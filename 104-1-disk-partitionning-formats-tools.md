## Partitionning Schemes
- to be able to install multiple filesystems on a disk, it must be partitionned first: prepare isolated, continuous space, called **disk partition**, for each filesystem.
- a partition is defined by the following attributes: label, universally unique id (uuid), type, number of start and end blocks.
- each partitionned disk should have a **partition table** located at the very beginning, listing various information on the disk partitions, if any, and the operating system boot-related informations.
- there are two partitioning formats: the "dos" format (MBR), which is being gradually deprecated in favor of the newer GUID Partition Table (GPT). GPT allows you to have largersmore partitions on disks, with even larger sizes.
	- With the MBR scheme, at most 4 partitions are allowed in the disk, which the GPT allows for uo to 128 partitions.
	- Partition table is typically written at the beginning of the disk
	- Partition table must contain how partitions are there in the disk, where do they start, they finish, the partition type, whther it is bootable or not, etc.

- The GPT format: <a title="The original uploader was Kbolino at English Wikipedia., CC BY-SA 2.5 &lt;https://creativecommons.org/licenses/by-sa/2.5&gt;, via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:GUID_Partition_Table_Scheme.svg"><img width="256" alt="GUID Partition Table Scheme" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/GUID_Partition_Table_Scheme.svg/256px-GUID_Partition_Table_Scheme.svg.png"></a>

```console
root@debian:/home/gcr# parted -l  /dev/sda
Model: VMware, VMware Virtual S (scsi)
Disk /dev/sda: 21.5GB
Sector size (logical/physical): 512B/512B
Partition Table: msdos
Disk Flags: 

Number  Start   End     Size    Type      File system     Flags
 1      1049kB  20.4GB  20.4GB  primary   ext4            boot
 2      20.4GB  21.5GB  1072MB  extended
 5      20.4GB  21.5GB  1072MB  logical   linux-swap(v1)
```

# Examples with ```parted``` and ```fdisk```
- create, list, remove partitions