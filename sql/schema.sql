DROP DATABASE IF EXISTS iwa;
CREATE DATABASE iwa;
DROP USER IF EXISTS iwa;
CREATE USER 'iwa'@'%' IDENTIFIED BY 'iwa';
GRANT ALL PRIVILEGES ON iwa.* TO 'iwa'@'%';

USE iwa;

CREATE TABLE accounts
(
    id              binary(16)      not null,
    username        varchar(50)     not null,
    password        varchar(255)    not null,
    email           varchar(100)    not null,
    primary key (id)
);

CREATE TABLE products
(
    id              binary(16)      not null,
    code            varchar(255)    not null,
    name            varchar(255)    not null,
    summary         text            not null,
    description     text            not null,
    image           varchar(255),
    price           float           not null,
    on_sale         bit(1)          default 0 not null,
    sale_price      float           default 0.0 not null,
    in_stock        bit(1)          default 1 not null,
    time_to_stock   integer         default 0 not null,
    rating          integer         default 1 not null,
    available       bit(1)          default 1 not null,
    primary key (id)
);
