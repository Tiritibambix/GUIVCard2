# GUIVCard2

A Vue.js based CardDAV client for Radicale server with Docker support. This application allows you to manage your contacts through a modern web interface.

## Features

- Connect to any Radicale CardDAV server
- View, create, edit, and delete contacts
- Support for vCard 4.0 format
- Responsive design with Bootstrap
- Docker support for easy deployment

## Prerequisites

- Docker and Docker Compose
- Radicale server (or any CardDAV compatible server)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/GUIVCard2.git
cd GUIVCard2
```

2. Build and run with Docker Compose:
```bash
docker-compose up --build
```

The application will be available at `http://localhost:8080`

## Configuration

The application can be configured through environment variables in the `docker-compose.yml` file:

- `VUE_APP_RADICALE_URL`: Your Radicale server URL (default: https://radicale.domain.com)

## Development

To run the application in development mode:

```bash
npm install
npm run serve
```

## Building for Production

To build the application for production:

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details