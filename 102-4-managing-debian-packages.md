# Debian Package Management

---
## Introduction
- How to install software?
	- find, download, check integrity
	- check requirements (libs, free space, etc.)
	- unpack, copy files (binaries, manuals, config. etc.) into correct locations
	- make additional setup, create additional files, users/groups, chmod, chown, etc.
- How to update software? Remove? Reinitialize configuration?
- (It is also possible to install from source)

---
## Package management system
- Software is distributed as a single file containing:
	- files making up the software
	- software attributes: version, requirements, maintainer, etc.
	- control information: install/remove/purge instructions
- Automates software management operations
- Handles any piece of software (dev headers, documentations, libs, kernel, etc.)
- There exist multiple packaging systems: **deb** for Debian, **rpm** for Redhat, and newer formats like **Flatpak**, **Snap**, **AppImage**
- tools like `alien` converts formats
---

## package system components (dpkg)
- `dpkg`: package manager, installs package from file, remove, purge, unpack, configure, etc.
- `/var/lib/dpkg/available` packages database
- `dpkg-query`: querying the packages database
- `dpkg-reconfigure`: reinstall conffiles and apply postinstall scripts
- `deselect`

---

## Advanced packaging tool (APT)
- `apt-get`: similar to dpkg, retrieves packages from servers, installs, removes, purges, etc.
	- handles dependencies
- `/etc/apt/sources.list`: package repositories list
- `apt-cache`: updates the lists of known packages (packages cache, stored in `/var/lib/apt/lists/`)
- Tools with GUI/ncurses : `aptitude`, `synaptic`
---

## Additional tools
- `apt-mark`: show, changes install status of packages:
	- hold/unhold, auto/manual, showmanual
- `apt-key`: adds, removes, etc. keys to authenticate repositories (realease files, packages)
- `apt-source`
- `apt-config`

- `apt-file`
- `apt`
---

## A tour on packages
```bash
deb http://deb.debian.org/debian buster main
deb-src http://deb.debian.org/debian buster main
```
```bash
apt-get install firefox
apt-get update
apt-cache policy firefox
dpkg -l figlet
dpkg --listfiles usbutils
dpkg-reconfigure figlet
apt-cache show libwebpmux3
dpkg-query --showformat='"${binary:Package};${Installed-Size};${Size}\n"' --show  | sort -g -t\; -k2
apt-get autoremove
```



# TODO
- some common commands in this page https://wiki.debian.org/AptCLI
- find which commands and options are used in order to:
	install/remove/reinstall/update/purge/show packages
	check whether a package is installed
	search a package in the cache
	add a new repository to your system (this can be done directly by modifying the sources.list file)
	add a new cdrom-based repository (packages may be retrieved from an installation cdrom)
	fix dependencies
	search within package name and short description instead of searching within the long description (in order to narrow search)
	search the files contained within a package without installing it
	search what packages may have installed a specific package
	empty the cache contents
	upgrade a single package
	upgrade all the installed packages
	list all the installed packages
	list all the known packages
	remove a package files but keeps its configuration files
	download source packages (from servers defined using deb-src)
- what are "main", "non-free" and "backports" package components
- consider the Explorational Exercises in https://learning.lpi.org/en/learning-materials/101-500/102/102.4/102.4_01/

## Side notes
- repository (dépôt/entrepôt de package)
- mirror : a copy of a repository, typically nearer to your machine
- Debian Free Software Guidelines
- On the ".tar.gz" format: a file format used to group multiple files within a single file in a .tar format (called "archive") then compress it to reduce its size using the .gz format, thus giving .tar.gz file..
- packages does not always include applications, they may include source code, function libraries, manuals translations (into a different language), etc.
- a Linux distribution is an Operating System based on the Linux kernel
	- there are different distributions RedHat, Debian, Suse, Ubuntu, Mint, etc.
	- what do they have in common? essentially the Linux kernel, and the majority of the available packages.
- Linux distributions uses codenames in addition to numbered versions: check a list for Ubuntu here: https://en.wikipedia.org/wiki/Ubuntu_version_history