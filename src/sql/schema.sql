DROP DATABASE IF EXISTS iwa;
CREATE DATABASE iwa;
DROP USER IF EXISTS iwa;
CREATE USER 'iwa'@'%' IDENTIFIED BY 'iwa';
GRANT ALL PRIVILEGES ON iwa.* TO 'iwa'@'%';

USE iwa;

CREATE TABLE accounts
(
    `id`            binary(16)      not null,
    `username`      varchar(50)     not null,
    `password`      varchar(255)    not null,
    `email`         varchar(100)    not null,
    `mobile`        varchar(100)    default null,
    primary key (`id`),
    unique key `email` (`email`),
    unique key `mobile` (`mobile`)
);

CREATE TABLE cards 
(
    `id`            binary(16)      not null,
    `issuer`        varchar(255)    not null,
    `number`        varchar(255)    not null,    
    `name`          varchar(255)    not null,
    `address`       varchar(255)    default null,
    `country`       varchar(255)    default null,
    `expiry_month`  int(11)         not null,
    `expiry_year`   int(11)         not null,
    `preferred`     bit(1)          default 0 not null,
    `account`       binary(16)      default null,
    primary key (`id`),
    unique key `number` (`number`),
    key (`account`),
    constraint foreign key (`account`) references `accounts` (`id`)
);

CREATE TABLE products
(
    `id`            binary(16)      not null,
    `code`          varchar(255)    not null,
    `name`          varchar(255)    not null,
    `summary`       text            not null,
    `description`   text            not null,
    `image`         varchar(255),
    `price`         float           not null,
    `on_sale`       bit(1)          default 0 not null,
    `sale_price`    float           default 0.0 not null,
    `in_stock`      bit(1)          default 1 not null,
    `time_to_stock` integer         default 0 not null,
    `rating`        integer         default 1 not null,
    `available`     bit(1)          default 1 not null,
    primary key (`id`)
);
