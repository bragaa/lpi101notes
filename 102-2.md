---
marp: true
theme: 
class: 
paginate: true
---


# 102.2 Boot Loader
---

## Overview of the Linux boot process
- Firmware -> OS loader -> Kernel --> System initialization
- the motherboard's firmware prepares the hardware for use (detect, setup,) and installs basic drivers on memory for later steps
- the firmware finds, loads the OS loader from a boot device
    - using a standard method (IBM-PC or UEFI)
- the OS loader, aka boot loader loads Linux kernel, Windows boot loader, etc
    - interactive, menu-based process boot
- in case of linux, the boot loader will load and start the linux kernel
    which in turn runs
 - the kernel starts the `/sbin/init` will finally load user programs depending on the intended use of the computer: it will load the graphical user interface, database servers, cron servers, syslog server, web servers, etc.
---

## Boot Loader
- executable code which finds and loads into memory the **Linux kernel** and the **initialization ramdisk** (initrd).
- installed on disk during OS install, on location expected by the used firmware
- Evolution path: LILO → GRUB Legacy (0.9x) → GRUB2
- GRUB2 is modular and implements drivers to multiple devices and filesystems
---

## GRUB2 architecture
- in order to adapt to various disk layouts, GRUB2 has various binaries:
    - `core.img` main binary (stage 1.5), enough to load config
    - `boot.img` used within MBR to load the `core.img`
    - `*.mod`, dynamicall loadable modules
- compatible with UEFI/GPT, PC BIOS with MBR, and PC BIOS with GPT.
- location of the GRUB2 binary (core.img):
    - UEFI: ESP and /boot
    - PC BIOS with GPT: multiple stages boot, uses BIOS Boot Partition
    - PC-BIOS with MBR: store grub boot files in the MBR gap immediately after the MBR (1MiB)
- main configuration file,  used on boot `/boot/grub/grub.cfg`
- configuration is statically generated from `/etc/default/grub` and `/etc/grub.d/*`
---

## Installing GRUB2
- install binaries on device, depending on the partitionning scheme and firmware
    - for MBR, `grub-install --target=i386-pc /dev/sdX`
    - for UEFI, `grub-install --target=x86_64-efi --efi-directory=esp --bootloader-id=GRUB`
    - binary can be signed for secure boot
- generate the configuration file to be used on boot
    - helper scripts in `/etc/grub.d/*`
    - global configuration in `/etc/default/grub`
---

## GRUB vs GRUB2
- features:
  - able to load multiple OS run the linux kernel (chain loading method)
  - can pass user defined parameters (stored by the OS loader)
---

## Interacting with GRUB 2
- interact with GRUB2
---

## Additional commands
- `grub-mkconfig -o /boot/grub/grub.cfg` to create the configuration
- from `/etc/grub.d/00_header`: `GRUB_TIMEOUT`, GRUB_DEFAULT, GRUB_GFXMODE,
