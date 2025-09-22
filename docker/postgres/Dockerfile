FROM postgres:17

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       git \
       ca-certificates \
       postgresql-server-dev-17 \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/fboulnois/pg_uuidv7.git /tmp/pg_uuidv7 \
    && cd /tmp/pg_uuidv7 \
    && make && make install \
    && rm -rf /tmp/pg_uuidv7

COPY init.sh /docker-entrypoint-initdb.d/init.sh
RUN chmod +x /docker-entrypoint-initdb.d/init.sh
