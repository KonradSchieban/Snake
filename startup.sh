#!/bin/bash
yum install -y httpd
service httpd start
yum install -y git

cd /var/www/html/
git clone https://github.com/KonradSchieban/Snake.git
