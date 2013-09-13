#!/bin/bash

echo "Creating directory for data"
mkdir data
cd data
echo "Start downloading data..."
echo "Downloading Transit Schedule Data"
curl -o "transit_data.zip" "https://www.halifaxopendata.ca/api/file_data/0z8ZJRFZVdpB-2JaEt_6DZ48hCGUaD-kiPy2vBYQElY?filename=google_transit.zip"
echo "Unzipping data"
unzip "transit_data.zip" -d "transit_data"
echo "Done."
