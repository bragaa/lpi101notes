---
marp: true
theme: gaia
paginate: true
class: into
---

# Systemd
A Linux Initialization Scheme

---
## Overview
- once the kernel loaded and the root file system mounted, the user-oriented applications and services must now be loaded (network interface configuration, web server, remote file systems, etc.) 
- for this purpose, the system is modelled as collection of components called **units**
	- various types: services, sockets, mount, slice, [cf. systemd(1)/CONCEPTS]
	- the sysadmin defines the configuration of each system unit in a text file, a **unit file** ; it gives the unit properties: program name, uid/gid, state, dependencies, etc. This depends on the unit type.
- The set of components that must be brought up during system initialization is called **target** or **runlevel** (itself modelled as a unit).
	- the system may define multiple targets, with a default one (set by the kernel `systemd.unit` argument, systemd cmd line `unit` arg or `/usr/lib/systemd/system/default.target` symlink.)
	- making the targets customizable is useful if the sysadmin wants to load a minimal set of applications, for maintenance: a state without graphical interface, or without multi-users support, etc.
	- targets can also be used as synchronization point during system initialization (can be viewed as an intermediate target)
- the `systemd` (the system daemon, aka system manager,) is reponsible for reaching (and enforcing) the desired target:
	- selecting units required in the target
	- implementing units configuration (read, apply, monitor for failures)
- units configuration is managed through `systemctl`
- intended as a replacement for the *System V* scheme and the Ubuntu's *upstart*
- preserves compatibility with System V on many aspects

---
## Units states
- each unit has *load* state, *enablement* state, and *activation* state and substate
- systemd will try to *load* all the avaialble unit files: read them, determine to which target they belong, dependencies, etc. Nothing is applied. a unit may be reported as failed in case of unit file error (among other reasons).
- a unit is *enabled* if administratively set to be started in a given target. (though, a unit may be manually enabled; this applies until reboot, i.e. transient or runtime enablement)
	- a unit is *disabled* to remove it from the current target
	- a unit is *masked* to prevent manual enablement as long as the computer is running.
	- you may want to read about the *linked* and the *static* enablement states.
- systemd will try to *activate*, i.e. start (apply unit file config) those units enabled in the given target. Thus the *active* state. The semantics of the substate depends on the unit type.

---
## Unit files
- They hold configuration properties: User/Group, KillMode, ExecStart, PIDFile, etc.
- locations of the systemd units: 
	- /etc/systemd/system (by sysadmin)
	- /run/systemd/system (during runtime)
	- /lib/systemd/system (from packages maintainers)
	- /usr/lib/systemd/user (user units)
- sysadmin units take precedence over maintainers'
- runlevels are called targets
- see boot(7) for overview of the System V Initialization scheme

---
## Example: Unit file for nginx web server
- `/lib/systemd/system/nginx.service`, from nginx-common package
- using `systemctl cat nginx.service` (`show` will give the complete unit attributes)
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
## Systemctl
- `systemctl [OPTIONS...] COMMAND [NAME...]`
- a frontend to the service manager (systemd)
- start, stop, reload, restart, try-restart, reset-failed
- daemon-reload
- list-{units,unit-files,timers,sockets,dependencies,machines}
- isolate (assumes target units by default)
- show, cat
- `kill` for more granular control
- get-default, set-default, emergency, isolate, default,rescue,emergency,halt,reboot,poweroff
- enable,link,disable,preset,preset-all,revert
	- link is for files not in unit files search paths
	- revert is for unit files
- mask,unmask
- is-{enabled,failed,active,system-running}, status
- add-wants, add-requires
- edit (to add a drop in)

---
## Units types: Service
- We are discussing the system model according to *systemd*
- service: a process controlled and supervised by systemd
	- nginx.service models the nginx web server
	- dbus.service: D-Bus system message bus, offering IPC for process within a graphical desktop environment
	- NetworkManager.service: the network configuration

---
## Unit types: Target
- target: models the *state of the system* as a group of units, or defines a synchronization point during boot-up. runlevels are implemented as targets
	- common ones are listed using 

---
## Units types: miscellaneous
- socket: a socket (either local or network), required by other service units. may be used to implement on-demand starting of services.
- timer: for triggering activation of other units based on timers
- device: used to implement device-based activation
- path: used to implement file system objects based activation
- automount: for automount activation
- mount: control mount points in the filesystems
- swap: encapsulate memory swap partitions or files of the operating system.
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

```bash
systemctl --failed
systemctl mask nginx.service
systemctl is-active nginx
systemd-analyze verify nginx.service
journalctl -u nginx.service
systemctl daemon-reload
systemctl reload dhcpd@ens33.service
systemctl reload dhcpd@.service
systemctl list-dependencies --all nginx.service
systemctl list-units --all --type service --state=inactive
```


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

cat machine-info
less machine-id
hostnamectl # to show and set machine information (transient, set at boot and received from network configuration)

```
---


## Lab Session: Integration with systemd
- goal: allow systemd to manage `myserver`
- create service unit file `myserver.service`
