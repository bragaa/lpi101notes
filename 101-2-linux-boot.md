## Boot Sequence Overview
- Here are the steps: Firmware -> OS loader -> Kernel --> System initialization
1. the motherboard contains a **firmware** and an **non volatile memory** (NVRAM) whose role is to:
  - check, test the available hardware (RAM size, CPU model, VGA adapters, keyboard). This test is generally referred to with Power-on self test (POST)
  - discover the buses (chiefly PCI) and the connected I/O peripherals, then allocate them whatever resources required to be able to communicate with the CPU: DMA addresses, interrupt requests identifiers, i/o ports, etc.
  - configure hardware and I/O peripherals with user-defined configuration parameters from the NVRAM
  - finds, loads into memory and start the **OS loader** (aka bootloader program). The NVRAM tells the boot device where the OS loader will be loaded from.
2. once executed, the OS loader is responsible for the following tasks:
  - find, load into memory the files containing the **linux kernel** and the **initialization ramdisk** (initrd). It must have loaded drivers to be able to access these files, (device drivers, filesystems drivers)
  - run the linux kernel, and it any user defined parameters (stored by the OS loader)
  - Note: the OS loader is also able to load another OS loader (to load Windows for instance)
3. the linux kernel completes its initialization, it will
  - unpack the initrd into memory in order to extract drivers required to load the filesystem that will be used as a root
  - load the device drivers (as linux kernel modules) for the discovered devices
  - initialize the kernel data functions: virtual memory management, scheduler operation, device drivers, swap space, system calls handlers, the special filesystems (proc, dev, sys,) etc.
  - run the threads used by the linux kernel.
  - run the `/sbin/init` program (PID no.1) .
4. the `/sbin/init` will finally load user programs depending on the intended use of the computer: it will load the graphical user interface, database servers, cron servers, syslog server, web servers, etc.

---
## Firmware
- There are two standards defining the interface between the firmware and the OS loader: IBM-PC and UEFI.
- This interface defines where the OS loader should be installed to be loaded correctly by the firmware, the memory content when the OS loader will run, etc.
- In the IBM-PC specifies that the boot loader should be installed in the first 448 bytes of the boot disk (sector no. 0, called **Master boot record**). So the Firmware just copies this content into memory and starts it.
- In the UEFI, the boot loader is a file in a FAT-formatted partition. The file is an executable in the PE format.
- Being newer, the UEFI-capable firmwares:
  - are able to boot in backward compatible mode (aka UEFI-CSM, standing for **Compatibility support mode**), which basically means that an UEFI-capable firmware can boot an IBM-PC compatible bootloader.
  - features a **Secure boot** mode, where the signature of the boot loader file is checked first.

---
# UEFI-based computers boot sequence
- UEFI firmware boots loader and utilities from ESP partition
	- the ESP partition is itself formatted as FAT32-like partition
	- contains different tools: the loader, the kernel image, some device drivers required in boot, utilities used before boot (various diagnostics) and log files
- the loader will look for the kernel (which configuration)
- When booting in UEFI-CSM , the UEFI firmware will transfer control to the boot sector. Similar to what the BIOS used to do.

---
## Kernel Ring
- The kernel logs startup events in a circular file (hence the name *ring*):
```console
[    0.000000] Linux version 4.0.0-32-generic (buildd@lgw01-amd64-015) (gcc version 7.4.0 (Ubuntu 7.4.0-1ubuntu1~18.04.1)) #34~18.04.2-Ubuntu SMP Thu Oct 10 10:36:02 UTC 2019 (Ubuntu 5.0.0-32.34~18.04.2-generic 5.0.21)
[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-4.0.0-32-generic root=UUID=23d58d1a-ee4c-4451-b26c-78563c6bc040 ro quiet splash vt.handoff=1
[    0.000000] KERNEL supported cpus:
[    0.000000]   Intel GenuineIntel
[    0.000000]   AMD AuthenticAMD
[    0.000000]   Hygon HygonGenuine
[    0.000000]   Centaur CentaurHauls
[    0.000000] x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'
[    0.000000] x86/fpu: Supporting XSAVE feature 0x002: 'SSE registers'
[    0.000000] x86/fpu: Supporting XSAVE feature 0x004: 'AVX registers'
[    0.000000] x86/fpu: Supporting XSAVE feature 0x008: 'MPX bounds registers'
[    0.000000] x86/fpu: Supporting XSAVE feature 0x010: 'MPX CSR'
[    0.000000] x86/fpu: xstate_offset[2]:  576, xstate_sizes[2]:  256
[    0.000000] x86/fpu: xstate_offset[3]:  832, xstate_sizes[3]:   64
[    0.000000] x86/fpu: xstate_offset[4]:  896, xstate_sizes[4]:   64
[    0.000000] x86/fpu: Enabled xstate features 0x1f, context size is 960 bytes, using 'compacted' format.
[    0.000000] BIOS-provided physical RAM map:
[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x0000000000057fff] usable
```
tbd%bg: More comments on linux kernel shoudl be added.
---

## Boot Loader (aka OS Loader)
- the boot loader is a small program installed on disk as part of the OS installation, which conforms to the OS-firmware interface.
- Evolution path: Lilo → Grub Legacy → Grub2
- There are two partitionning schemes: gpt (from UEFI) and dos (defacto standard by IBM/MS)

---
## System initialization
- there are two main schemes: **system V** and **systemd** (**upstart** is deprecated)
- the role is to allow the system administrator:
 - define which programs run at startup,
 - handle start/stop/failures of programs,
 - define a running system state (runlevels aka targets),
- example of services (aka daemons) that an initialization program must bring up: open-ssh server, networking, apache (web server), cron, rsyslog, etc. They are not concerned with kernel related stuff like kernel modules, device detection (they altough can help manage them)
