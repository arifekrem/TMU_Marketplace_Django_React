## Deployment Steps

### 1. Setup Virtual Environment

Navigate to your server root:
```
cd server
```

Create and activate a virtual environment:
```
python3 -m venv .venv
source .venv/bin.activate
```

Install dependencies:
```
pip install -r requirements.txt
```

### 2. Gunicorn Configuration

Create symbolic links for systemd configurations to create background gunicorn service:
```
sudo ln -s /path/to/your-project-directory/deployment/gunicorn.service /etc/systemd/system/gunicorn.service
sudo ln -s /path/to/your-project-directory/deployment/gunicorn.socket /etc/systemd/system/gunicorn.socket
```

Start and enable Gunicorn:
```
sudo systemctl start gunicorn.socket
sudo systemctl enable gunicorn.socket
```

### 3. Nginx Configuration
Open the Nginx configuration file and replace example.com and www.example.com with your actual server URL or domain name
```
nano deployment/tmu-marketplace-nginx.conf
```

Link your Nginx config:
```
sudo ln -s /path/to/your-project-directory/deployment/tmu-marketplace-nginx.conf /etc/nginx/sites-available/tmu-marketplace
sudo ln -s /etc/nginx/sites-available/tmu-marketplace /etc/nginx/sites-enabled
```

Test and reload Nginx:
```
sudo nginx -t
sudo systemctl reload nginx
```

## Troubleshooting
- For issues, review Gunicorn (`journalctl -u gunicorn`) and Nginx logs (`/var/log/nginx/error.log`).

