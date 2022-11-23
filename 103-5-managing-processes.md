# process properties

# managing processes

# bash jobs
- processes are called **jobs** in shell terms.

## Jobs
```bash

$ firefox &  # creates background task that is not using the terminal
[1] 10167
# 1 is the job id within the current bash, 10167 is the system wide PID.
$ # we get the terminal as process is running in the background
$ fg 1 # makes the process come to the foreground in the current bash

```
- jobs, bg,
- how to send a process to the background

# signals
