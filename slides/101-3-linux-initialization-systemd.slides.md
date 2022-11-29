---
marp: true
theme: 
paginate: true
class: 
---

# Systemd
A Linux Initialization Scheme

---
## Where does systemd fit?
- A full Linux OS is made up of:
    - kernel
    - root filesystem
    - programs: daemons, user interface (desktop, cli), etc.
- **systemd** lets sysadmin control dynamic state of the system:
    - start/stop programs, recover failed ones,
    - handle dependency, etc.
- A replacement for the *System V* and the Ubuntu's *upstart*
- Preserves compatibility with System V on many aspects
---

## Systemd concepts
- The system is modelled as collection of components called **units**: various types: services, sockets, mount, slice, [cf. systemd(1)/CONCEPTS]
- For each unit, a **unit file** defines the unit properties: program name, uid/gid, state, dependencies, etc.
- An operational state of the system is defined by the set running units.
- Systemd allows enforcing an operationl states of the system, called **target** or **runlevel** (itself modelled as a unit): maintenance, graphical, network, etc.
---

## Example: Unit file for nginx web server
- `/lib/systemd/system/nginx.service`, from `nginx-common` package
```ini
[Unit]
Description=A high performance web server and a reverse proxy server
Documentation=man:nginx(8)
After=network.target
[Service]
Type=forking
PIDFile=/run/nginx.pid
ExecStart=/usr/sbin/nginx -g 'daemon on; master_process on;'
ExecReload=/usr/sbin/nginx -g 'daemon on; master_process on;' -s reload
ExecStop=-/sbin/start-stop-daemon --quiet --stop --retry QUIT/5 --pidfile /run/nginx.pid
TimeoutStopSec=5
KillMode=mixed
[Install]
WantedBy=multi-user.target
```
---

## Example: nginx
```console
gcr@debian:~$ systemctl status nginx.service 
● nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Fri 2022-03-11 15:20:30 CET; 23h ago
     Docs: man:nginx(8)
 Main PID: 10575 (nginx)
    Tasks: 3 (limit: 3331)
   Memory: 8.8M
   CGroup: /system.slice/nginx.service
           ├─10575 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
           ├─10577 nginx: worker process
           └─10578 nginx: worker process
```
---

## Processing units
- each unit has a **load** state, **enablement** state, and **activation** state and substate
- a unit can be **enabled**, **disabled** in a given target
    - temporarily
	- a unit can be **masked** to prevent manual enablement as long as the computer is running.

     , or **masked**  in a given target if administratively set to start in that target.
    -  (though, this may happen only until reboot, i.e. transient or runtime enablement)
	- a unit is *disabled* to removed it from the current target
	- you may want to read about the *linked* enablement state.
- `systemd` will try to
    - **load** units (parsing unit files, building dependencies, )
    - **activate** enabled units until reaching the target runlevel
- the **default target** is defined by 

- systemd will try to activate, i.e. start (apply unit file config) those units enabled in the given target. Thus the active state. A substate depends on the unit type.
---

## Example: nginx unit state
```console
gcr@debian:~$ sudo systemctl stop nginx.service 
[sudo] password for gcr: 
gcr@debian:~$ systemctl status nginx.service
● nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: inactive (dead) since Sat 2022-03-12 15:46:35 CET; 10h ago
     Docs: man:nginx(8)
  Process: 12562 ExecStop=/sbin/start-stop-daemon --quiet --stop 
                        --retry QUIT/5 --pidfile /run/nginx.pid
             (code=exited, status=0/SUCCESS)
 Main PID: 10575 (code=exited, status=0/SUCCESS)
```
---

## Unit files
- Configuration properties: User/Group, KillMode, ExecStart, PIDFile, etc.
- locations of the systemd units (in decreasing priority):
	- /etc/systemd/system (by sysadmin)
	- /run/systemd/system (during runtime)
	- /lib/systemd/system (from packages maintainers)
	- /usr/lib/systemd/user (user units)
- boot(7) for overview of the System V Initialization scheme
---

## Controlling units
- `systemctl` is *the* frontend to systemd
  `systemctl [OPTIONS...] COMMAND [NAME...]`
- commands: start,stop,reload,restart,try-restart,reset-failed
- reload-exec, reload-daemon
- list-{units,unit-files,timers,sockets,dependencies,machines}
- isolate (assumes target units by default)
- show, cat
- `kill` for more granular control
- get-default, set-default, emergency, isolate, default,rescue,emergency,halt,reboot,poweroff

---
## Systemctl
- enable,link,disable,preset,preset-all,revert
	- link is for files not in unit files search paths
	- revert is for unit files
- mask,unmask
- is-{enabled,failed,active,system-running}, status
- add-wants, add-requires
- edit (to add a drop in)

---
## Units types 1/n
- We are discussing the system model according to *systemd*
- service: a process controlled and supervised by systemd
	- nginx.service models the nginx web server
	- dbus.service: D-Bus system message bus, offering IPC for process within a graphical desktop environment
	- NetworkManager.service: the network configuration
- target: models the *state of the system* as a group of units, or defines a synchronization point during boot-up. runlevels are implemented as targets

---
## Units types 2/n
- socket: a socket (either local or network), required by other service units. may be used to implement on-demand starting of services.
- timer: for triggering activation of other units based on timers
- device: used to implement device-based activation
- path: used to implement file system objects based activation
- automount: for automount activation
- mount: control mount points in the filesystems
- swap: encapsulate memory swap partitions or files of the operating system.

---
## Unit types 3/n
- scope: similar purpose as slice, but for systemd-foreign processes
- slice: for grouping units which consumes system resources (service units, scope units, socket units, etc.) in order to control resources consumtions
	- units are broken into system slice and one or more user slices

---
## Service units
- we've seen that in nginx.service unit

---

## Target units
- graphical good explanation of targets in bootup(7)
- logical grouping, synchronization points during the system bootup
- special targets (check for exaplanation in bootup(7):
	- emergency comprises pid 1 and a shell
	- rescue is a single user, with all mounts and basic services, used also for diagnosis
	- basic
	- multi-user
	- graphical
- backward compatible with sysvinit (0,1,6,3=multiuser,5-graphical)

---

## Slice units
-

---
## Manage a custom service with systemd
- Let systemd control the state of `myserver`:
	- automatically run it in a specific runlevel
	- manage logging with `journalctl`
	- restart server upon failures
- myserver is a simple terminal server. it is made up of:
	- binary file,
	- manual page,
	- configuration file,
	- log file
- default requirements on myserver:
	- depends on networking,
	- run with root privileges,
- which clause in unit property defines the target in which the unit runs?

---
## The unit configuration file
- Create the unit file /etc/systemd/system/myserver.service
```ini
[Unit]
Description=A trivial terminal server for illustration purposes
Documentation=man:myserver(8)
After=network.target
[Service]
Type=forking
PIDFile=/run/myserver.pid
ExecStart=/usr/sbin/myserver
ExecReload=/usr/sbin/myserver
ExecStop=-/sbin/start-stop-daemon --quiet --stop --retry QUIT/5 --pidfile /run/myserver.pid
TimeoutStopSec=5
KillMode=mixed
[Install]
WantedBy=multi-user.target
```

---
## Next steps
- force systemd daemon to read and load the unit file:
	`systemctl daemon-reload`
- systemctl start myserver
- systemctl status myserver
- Try to connect to the server,
- check logs
	`journalctl `


---
## Common systemd management tasks
- get/set the default target
- switch runlevel


- systemd-analyze blame|plot|critical-chain
- systemd-delta

---
## Related commands
```bash
# print runlevel (current and previous)
who
runlevel
# different ways to reboot the system (the same with runlevel 0)
init 6
telinit 6
shutdown -r now
reboot
# shutdown, various behaviours, a time specification
# shutdown -P|H|r
shutdown -h 16:00 "system is powering off, save and quit" # time format  +0:30
halt -f
# warn all users
wall "an antivirus analysis is being done, system may slow down for few minutes"
# check -g, -t
# check what happened during boot
$ dmesg
journalctl -kx
# perform various verification on the unit file provided (missing man pages or execstart binaries, bad file properties, )
$ systemd-analyze verify ./user.slice
```
---


## Lab Session: Integration with systemd
- goal: allow systemd to manage `myserver`
- create service unit file `myserver.service`
