A PCI device is identified by VendorID/ProductionID

Example of PCI device output
```shell
$ lspci -vvv

03:00.0 Network controller: Intel Corporation Wireless 3165 (rev 79)
	Subsystem: Intel Corporation Wireless 3165
	Control: I/O- Mem+ BusMaster+ SpecCycle- MemWINV- VGASnoop- ParErr- Stepping- SERR- FastB2B- DisINTx+
	Status: Cap+ 66MHz- UDF- FastB2B- ParErr- DEVSEL=fast >TAbort- <TAbort- <MAbort- >SERR- <PERR- INTx-
	Latency: 0
	Interrupt: pin A routed to IRQ 141
	Region 0: Memory at df100000 (64-bit, non-prefetchable) [size=8K]
	Capabilities: <access denied>
	Kernel driver in use: iwlwifi
	Kernel modules: iwlwifi

```
