# * coding : utf-8

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pandas as pd
from selenium.common.exceptions import *
import pymysql

username = "83638929@qq.com"
password = "K6aZqC[=3thk@ZuUmeiE"
timeout = 50

FaceBookToken = {
    "Clean Master": {
        "id": "500847713340465",
        "token": "k2Kq9JgdU9GsoNonN57zK7nr1io"
    },
    "CM Security": {
        "id": "1560332927520944",
        "token": "31g3jhFuZhKyRvHw5okjbeBnTsY"
    },
    "Battery Doctor": {
        "id": "715063988584856",
        "token": "r5ZEORnyisDS6PjDvE7m6dbwbBg"
    }
}


# 抓取Facebook指定时间范围内的全部配置产品数据
def spider_facebook_dashboard(since, until):
    def spider_facebook_dashboard_by_single_app(username, password, app, since, until):
        __channel__ = "Facebook"
        __source__ = "Dashboard"

        # 把字符串格式的日期（YYYY-MM-DD)转换为timestap（毫秒）字符串
        def to_timestamp(dt):
            import time
            return str(int(time.mktime(time.strptime(dt + ' 08:00:00', '%Y-%m-%d %H:%M:%S'))) * 1000)

        # 单次抓取函数
        def spider(username, password, app, since, until):
            driver = webdriver.Chrome()
            url = "https://www.facebook.com/analytics/{0}/?section=monetize&since={1}&until={2}".format(
                FaceBookToken[app]['id'], to_timestamp(since), to_timestamp(until))

            driver.get(url=url)

            elem = driver.find_element_by_css_selector('#email')
            elem.clear()
            elem.send_keys(username)

            elem = driver.find_element_by_css_selector('#pass')
            elem.clear()
            elem.send_keys(password)
            elem.send_keys(Keys.RETURN)

            try:
                # 找到Request，拉起
                selector = '._3img'
                WebDriverWait(driver, timeout, 2).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                )

                elem = driver.find_element_by_css_selector(selector)
                elem.click()

                # 切换到Detail By Date
                selector = '#js_10 > div > ul > li:nth-child(5)'
                WebDriverWait(driver, timeout, 3).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                )
                elem = driver.find_element_by_css_selector(selector)
                elem.click()

                selector = '#pagelet_content > div > div._1fj1 > div > div._1xy9._45-q._5aj7 > div._4bl9 > div:nth-child(2) > \
                        div:nth-child(2) > div._25q1'
                WebDriverWait(driver, timeout, 2).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                )
                elem = driver.find_element_by_css_selector(selector)
                elem.click()

                selector = '#pagelet_content > div > div._1fj1 > div > div._1xy9._45-q._5aj7 > \
                                                            div._4bl9 > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > \
                                                            div:nth-child(2) > div:nth-child(3) > table'
                WebDriverWait(driver, timeout, 2).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                )

                elem = driver.find_element_by_css_selector(selector)

                columns = ['Requests', 'Filled', 'Impressions', 'Clicks', 'FillRate', 'CTR', 'eCPM', 'Revenue']
                df = pd.read_html(elem.get_attribute('outerHTML'), header=0, parse_dates=True, index_col=0)[0]
                df.columns = columns
                df['Channel'] = __channel__
                df['Source'] = __source__
                df['Product'] = app
                return df

            except NoSuchElementException as e:
                print("No Such Element" + e.msg)

            except TimeoutException as e:
                print("Timeout" + e.msg)

            except BaseException as e:
                print(e)
            finally:
                driver.quit()

            return None

        '''
            函数执行主体
            尝试三次抓取, 原因是FaceBook网站经常DOM判断超时
        '''

        for i in range(3):
            data = spider(username=username, password=password, app=app, since=since, until=until)
            if data is not None:
                return data
        return None

    result = None

    for app in FaceBookToken.keys():
        print(app)
        data = spider_facebook_dashboard_by_single_app(username=username, password=password, app=app,
                                                       since=since, until=until)
        print(data)
        print('-' * 20)
        if result is None:
            result = data
        else:
            result = pd.concat([result, data])

    return result


def spider_facebook_cmbi(since, until):
    __host__ = 'offer-hero.cq7ehxlwlj3o.us-west-2.rds.amazonaws.com'
    __usernam__ = 'offer_hero'
    __password__ = 'ue9ye6tlvjk4s4f6usrhnj0nbm7gb20'
    __database__ = 'offer_hero'
    __channel__ = 'Facebook'
    __source__ = 'CMBI'

    sql = "SELECT date_format(settlement_date,'%Y-%m-%d') as Date,app_name as app ,sum(earnings) as Revenue " \
          "FROM offer_facebook_3day_placement_2016 " \
          "where settlement_date >= \'{0}\' and settlement_date <=\'{1}\'" \
          "group by settlement_date,app_name ".format(since, until)
    connection = pymysql.connect(host=__host__,
                                 user=__usernam__,
                                 password=__password__,
                                 db=__database__,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)

    try:
        data = pd.read_sql(sql, con=connection, index_col=['Date'], parse_dates=True)
        data.columns = ['Product', 'Revenue']
        data['Channel'] = __channel__
        data['Source'] = __source__

    finally:
        connection.close()

    return data


def spider_with_debug(since, until):
    debug_data = 'databash.csv'
    data = spider_facebook_dashboard(since='2016-10-15', until='2016-10-27')
    data.to_csv(debug_data)
    data_dashboard = pd.DataFrame.from_csv(debug_data)
    data_cmbi = spider_facebook_cmbi(since='2016-10-15', until='2016-10-30')

    data_dashboard_revenue = data_dashboard.loc[:, ['Source', 'Product', 'Revenue']]
    data_cmbi_revenue = data_cmbi.loc[:, ['Source', 'Product', 'Revenue']]
    # data_cmbi_revenue.loc[lc['Product'], :]

    total = data_dashboard_revenue.append(data_cmbi_revenue)
    return total


def spider_output_html(since, until):
    data = spider_with_debug(since=since, until=until)
    return data.to_html()


if __name__ == '__main__':
    print(spider_with_debug(since='2016-10-15', until='2016-10-27'))
