---
title: "Hardening a Linux Server — SSH, Firewall, and Beyond"
date: 2024-12-20T10:00:00+00:00
draft: false
author: "Mahmoud"
tags:
  - DevOps
  - Linux
  - Security
  - InfoSec
image: /images/post.jpg
description: "Hardening a Linux server for production — SSH key-only auth, UFW/Fail2Ban, user management, and monitoring drawn from app-sec practice"
toc: true
---

## Introduction

Securing a Linux server is not optional — it's essential. Whether you're deploying a web application or managing infrastructure, these hardening steps will significantly reduce your attack surface.

This guide is based on my experience in application security and Linux server administration.

## 1. SSH Hardening

SSH is your primary access point — secure it first.

### Disable Root Login

Edit `/etc/ssh/sshd_config`:

```bash
PermitRootLogin no
```

### Use Key-Based Authentication

```bash
# Generate key pair on your local machine
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key to server
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server

# Disable password authentication
PasswordAuthentication no
PubkeyAuthentication yes
```

### Change Default Port

```bash
Port 2222  # Use any port above 1024
```

### Limit Login Attempts

```bash
MaxAuthTries 3
LoginGraceTime 60
```

Restart SSH after changes:

```bash
sudo systemctl restart sshd
```

## 2. Firewall Configuration

### UFW (Uncomplicated Firewall)

```bash
# Install UFW
sudo apt install ufw

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (your custom port)
sudo ufw allow 2222/tcp

# Allow web traffic
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

### iptables (Advanced)

```bash
# Flush existing rules
iptables -F

# Default policies
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow loopback
iptables -A INPUT -i lo -j ACCEPT

# Allow established connections
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow SSH
iptables -A INPUT -p tcp --dport 2222 -j ACCEPT

# Save rules
iptables-save > /etc/iptables.rules
```

## 3. Fail2Ban Setup

Automatically ban IPs with too many failed login attempts:

```bash
# Install
sudo apt install fail2ban

# Create local config
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```

Edit `/etc/fail2ban/jail.local`:

```ini
[sshd]
enabled = true
port = 2222
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
findtime = 600
```

```bash
# Start service
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Check banned IPs
sudo fail2ban-client status sshd
```

## 4. System Updates

Keep your system patched:

```bash
# Update package list and upgrade
sudo apt update && sudo apt upgrade -y

# Enable automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 5. User Management

### Create Non-Root User

```bash
# Create user
sudo adduser deploy

# Add to sudo group
sudo usermod -aG sudo deploy

# Switch to new user
su - deploy
```

### Limit sudo Access

Edit `/etc/sudoers` with `visudo`:

```bash
deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart myapp
```

## 6. File Permissions

### Secure Important Files

```bash
# SSH config
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# System files
chmod 644 /etc/passwd
chmod 640 /etc/shadow
```

### Find World-Writable Files

```bash
find / -type f -perm -002 -exec ls -l {} \; 2>/dev/null
```

## 7. Monitoring and Logging

### Check Auth Logs

```bash
# Failed login attempts
grep "Failed password" /var/log/auth.log | tail -20

# Successful logins
grep "Accepted" /var/log/auth.log | tail -20
```

### System Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop

# Check active connections
ss -tuln

# Check listening ports
netstat -tlnp
```

## Quick Checklist

- [ ] Disable root SSH login
- [ ] Enable key-based authentication
- [ ] Disable password authentication
- [ ] Change SSH port
- [ ] Configure firewall (UFW/iptables)
- [ ] Install and configure Fail2Ban
- [ ] Enable automatic security updates
- [ ] Create non-root user for deployment
- [ ] Set proper file permissions
- [ ] Enable logging and monitoring

## Conclusion

Server security is an ongoing process, not a one-time setup. Start with these essentials, monitor your logs regularly, and stay updated on new vulnerabilities and patches.

---

*This guide reflects practices I've applied during my Application Security internship and personal server administration.*
