---
marp: true
theme: gaia
paginate: true
class: into
---

# Overview of the Linux Boot Procedure
---

![](/mnt/data/enseignement/se1/imgs/boot-process-2.drawio.svg)
<!-- 
1. the motherboard contains a **firmware** and an **non volatile memory** (NVRAM)
2. once executed, the OS loader is responsible for the following tasks:
3. the linux kernel completes its initialization
4. the `/sbin/init` will finally load user programs depending on the intended use of the computer: it will load the graphical user interface, database servers, cron servers, syslog server, web servers, etc.
-->
---

![bg](/mnt/data/enseignement/se1/imgs/firmware-gui.drawio.svg)

<!--
- check hardware (RAM size, CPU model, display adapter, keyboard, ), aka Power-on self test (POST)
- discover buses (PCI-e, SATA, etc.) and the connected devices, then allocate them whatever resources required to be able to communicate with the CPU: DMA addresses, interrupt requests identifiers, i/o ports.
- apply user-defined configuration stored in NVRAM
- finds, loads into memory and start as **OS loader** program by following an order of preference
  - other boot devices includes: floppy, CDROM, network boot agent.
-->
---

## Firmware standards: UEFI
- Disks uses GUID partition table (GPT)
- EFI System Partition, a FAT-formatted partition, containing
  - Boot images, device drivers (in PE format)
- Backward compatible with IBM-PC interface (aka UEFI-CSM, **Compatibility support mode**), which means that an UEFI-compatible firmware can boot an IBM-PC-compatible OS loader.
- Features a **Secure boot** mode using cryptographic keys/certificates on chip, where
  - the signatures of the boot image/option ROM/device drivers are checked first beforehand
  - check whether the image is allowed or forbidden
---

![](/home/brahim/Pictures/GPT-MBR_Partition_Table_Schemes.svg)

---

## Firmware standards: IBM-PC
- The OS loader is installed in the first 446 bytes of the boot disk (sector no. 0, called **Master boot record**).
- Note: In most cases, the OS loader cannot fit in 446 bytes, and some complicated layout is usually used.
---

## comparaison of UEFI vs IBM compliant boot loades

---

## Boot Loader
- Finds and loads into memory the **Linux kernel** and the **initialization ramdisk** (initrd).
- Installed on disk (during OS install or later), in the location expected by firmware
- Evolution path: LiLo → GRUB Legacy → GRUB2
- GRUB2 features:
  - Modular, implements drivers for multiple devices and filesystems
  - Able to load Linux, multiboot specifiation compatible kernels, and chain loading method
  - menu interface and shell CLI
---

## Linux kernel and initrd
- kernel is a memory resident library:
  - handles core OS features: processes management, interrupts, virtual memory, access to device,
  - callable by user process (for I/O, inter process communications,)
  - a generic, fixed size program, extensible thanls and on-demand pluggable modules (for device drivers,)
- `initrd` is an in-memory filesystem, used in kernel initialization
  - module(s) to access root filesystem device
- Initializing the kernel involves the following:
  - unpack the initrd into memory
  - initialize the kernel features
  - run the threads used by the linux kernel
  - run the `/sbin/init` program (PID no.1) and pass parameters to it
---

## Linux kernel parameters
![](/home/brahim/enseignement/se1/imgs/kernel-params.drawio.svg)
- Running kernel params in `/proc/cmdline`
```console
me@mypc:~$ cat /proc/cmdline
BOOT_IMAGE=/boot/vmlinuz-5.2.3-32-generic root=UUID=23d58-c0-40 ro quiet splash vt.handoff=1
```
- Basic set of kernel parameters in GRUB var `GRUB_CMDLINE_LINUX`
- Common params: `mem`, `maxcpus`, `acpi`, `rootflags`, `single`, `S`, `resume`
---


## System initialization
- Start whatever (user-space) program needed on the computer: servers, graphical desktop,
  - occurs after kernel space initialization (device detection, drivers load, modules loading)
- There are two main schemes: **system V** and **systemd** (**upstart** is deprecated)
- They role is to allow the system administrator:
 - Define which programs and daemons run at startup,
 - Handle start/stop/failures of daemons,
 - Define a multiple running system states (runlevels aka targets),
---

## Interacting with GRUB2
- **e**dit menu entry, boot it with **x**
- GRUB2 Shell:
  - Try the following commands: `ls`, `lsblk`, `help`, `set root=`, `linux`, `initrd`, `boot`

---

## A tour on the kernel boot
- Use `dmesg` or `journalctl -k` to check kernel log (stored in a ring-like datastructure)
---