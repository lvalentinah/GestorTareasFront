#!/usr/bin/env bash
set -eux
rm ~/.npmrc | true
curl -u "fguerr3@bancodebogota.com.co:AKCp8kqX8z8baycy6HeoajXbukbQFdGPrMiYvpSC1GL8Fik9EeA9hQVuRwWXcy2nrDbbsMw5Q" 'https://bbogdigital.jfrog.io/bbogdigital/api/npm/auth' >> ~/.npmrc
# or replace ARTIFACTORY_READER_API_KEY by ARTIFACTORY_READER_PASSWORD if not exist
perl -i -pe 's#_auth#//bbogdigital.jfrog.io/bbogdigital/api/npm/npm-bbta/:_auth#g' ~/.npmrc
perl -i -pe 's#always-auth#//bbogdigital.jfrog.io/bbogdigital/api/npm/npm-bbta/:always-auth#g' ~/.npmrc
perl -i -pe 's#email#//bbogdigital.jfrog.io/bbogdigital/api/npm/npm-bbta/:email#g' ~/.npmrc
npm i # or npm install
