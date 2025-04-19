#!/bin/sh
set -e

echo "Starting GUIVCard2..."

# Wait a bit for everything to be ready
sleep 2

# Start serve with proper logging
exec serve -s dist -l 3000 2>&1 | tee /var/log/guivcard2.log