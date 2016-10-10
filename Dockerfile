FROM ubuntu

RUN apt-get update && \
  apt-get install -y python-pip python-dev curl build-essential pwgen libffi-dev sudo git-core wget \
  # Postgres client
  libpq-dev \
  # Additional packages required for data sources:
  libssl-dev libmysqlclient-dev freetds-dev libsasl2-dev && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*


# Users creation
RUN useradd --system --comment " " --create-home cmbi

# Pip requirements for all data source types
RUN pip install -U setuptools && \
  pip install supervisor

COPY . /opt/quickreport/current
RUN chown -R cmbi /opt/quickreport/current

# Setting working directory
WORKDIR /opt/redash/current

RUN pip install  -r requirements.txt

# Expose ports
EXPOSE 5000
EXPOSE 9001