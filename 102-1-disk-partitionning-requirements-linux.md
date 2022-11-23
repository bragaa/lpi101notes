---
marp: true
theme: 
class: 
paginate: true
---

# 102.1 Partitionning Requirements for Linux
---

## Recommended disk partitionning scheme
- `/boot`: for booting the kernel: kernel, initial ramdisk. at least 250MB. May also be colocated with the root file system. Must be of ext2/3/4 format.
- `/` (root filesystem): content of the root device 
- swap: for extending system memory
- home: contains user directories
- `/boot/efi`: used by the EFI system (hence the name ESP). 50-150MB
- Why create seperate partitions:
	- make ugrades easier, faster by seperating system, user, software data
	- prevent consuming space by variably sized partitions (`/home`, `/var`, `/tmp`, `/usr`) 
	- use different filesystems: encyption for sensitive data (home?), backward compatibility (ESP requires FAT),..
---

## The swap area
- an area on disk allocated as fixed size file or partition of type 0x82
- used by the kernel to extend the system memory, creating larger **virtual memory** for processes
	- also used for hibernation
- size depends on installed memory and desired performance: 1x-3x of the RAM ([recommendations](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/installation_guide/s2-diskpartrecommend-x86))
---

## Logical volume management (LVM)
![](https://d33wubrfki0l68.cloudfront.net/25a0e1b41e5df59ea98921d1e8134d5766753928/6978d/assets/images/linux/lucidchart/776f487c-152f-4a1c-b939-bffee8e5b9a9.png)

---

## Redundant arrays of independent disks (RAIDs)
- multiple storage devices are arranged to provide
	- increased performance (bandwidth)
	- greater fault tolerance (recover on disk failure)
- various operation modes:
	- 0: distributes data across multiple storage devices
	- 1: creates mirrors of a single disk device
	- 5: create n+1 fault tolerant storage
	- 10: combines 1 and 0 modes
- controlled at software or hardware levels
---