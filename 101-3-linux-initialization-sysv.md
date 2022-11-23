---
marp: true
//theme: gaia
paginate: true
class: into
---

# System V Init
A Linux Initialization Scheme

---
## Overview
- An operating system starts in 3 steps:
	- loading the kernel
	- mounting the root file system
	- initializing user space: configure devices, run servers, applications, etc.
- user space is modeled as a collection of **services** or **units**
	- may depend on each others
	- daemons
- user space is set in an operational level, aka **runlevel**
	- defined by the set of running services
---

## SysV runlevels
- 0: stopped
- 1: single user (root), used for maintenance, aka **rescue**
- 2,**3**,4: users sessions allowed.
- **5**: users allowed + graphical desktop
- 6: rebooting
---

## System components
- the initialization program, `/sbin/init`, used to put the system into a runlevel
	- run with PID=1, topmost parent of all processes
	- called by the kernel at startup
	- may be called later to change runlevel
- `/etc/init.d/`, contains service scripts,
	- used to start, stop, reload, services
	- define the default service attributes: dependencies, runlevels, service name in LSB compliant fashion
- `/etc/rcN.d/`, contains scripts telling how to reach runlevel N
	- links to service scripts
	- name implies whether to start or stop, ordered
---

## Controlling services practices
- package maintainer makes use of
	- `update-rc.d` to add/remove service to the desired runlevels (package post install)
	- `invoke-rc.d` (instead of `service`) to start/stop service
	- `/etc/init.d/skeleton` as a base for service scripts
- each service script stores defaults and the links are created accordingly
- sysadmin may want to 
	- alter defaults using `chkconfig` (redhat) or `update-rc.d` (debian)
	`update-rc.d -f nginx start 30 2 3 4 5 stop 70 0 1 6`
	- manually manage service using `service`
---

## Controlling services
```bash
service nginx status
service --status-all
service nginx logrotate
update-rc.d nginx add
service
runlevel
who -r
telinit 3
```
---

## History notes
- *System V init* scheme used `/etc/inittab` and `/etc/init.d/rc` script
- *upstart* by ubuntu, around 2006
- *systemd*, adopted in major distriubtions (Debian, Redhat, Ubuntu)