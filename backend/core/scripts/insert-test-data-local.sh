#!/usr/bin/env bash

aws dynamodb batch-write-item --request-items file://skill-test-data.json --region eu-central-1 --endpoint-url http://localhost:8000
aws dynamodb batch-write-item --request-items file://user-profile-test-data.json --region eu-central-1 --endpoint-url http://localhost:8000
