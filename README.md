![Logo](http://www.grapp.ivelin.info/static/images/grapp-logo.png)

## Installing WSL on Windows OS


Grapp depends on linux to execute binary files. For this reason we would have to install Linux virtual machine or linux terminal environment. For simplicity we will use WSL. The  following link is to a installation guide.

[How to install Windows Subsystem for Linux (WSL)](https://www.windowscentral.com/install-windows-subsystem-linux-windows-10) 

## Installing Python 3.7 on Ubuntu with Apt(if not installed)
Installing Python 3.7 on Ubuntu with apt is a relatively straightforward process. Start WSL and run the following commands.


1. First, update the packages list and install the packages necessary to build Python source:
```bash
  sudo apt update
```

```bash
  sudo apt install build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libsqlite3-dev libreadline-dev libffi-dev wget libbz2-dev
```
2. Download the latest release’s source code from the Python download page using the following wget command:

```bash
  wget https://www.python.org/ftp/python/3.7.4/Python-3.7.4.tgz
```
Once the download is completed, extract the gzipped tarball :

```bash
  tar -xf Python-3.7.4.tgz
```
3. Next, navigate to the Python source directory and run the configure script which will perform a number of checks to make sure all of the dependencies on your system are present:

```bash
 ./configure --enable-optimizations
```

4. Start the Python build process using make

```bash
 make -j 4
```
For faster build time, modify the -j flag according to your processor. If you do not know the number of cores in your processor, you can find it by typing nproc. The system used in this guide has 4 cores, so we are using the -j4 flag.

5.When the build is done, install the Python binaries by running the following command:

```bash
sudo make altinstall
```
Do not use the standard make install as it will overwrite the default system python3 binary.

6. At this point, Python 3.7 is installed on your  system and ready to be used. You can verify it by typing:

```bash
  python3.7 --version
```

## Create Virtual Environment for Python 3.7 
Let’s start by installing the `python3.7-venv` package that provides the venv module.Which creates python virtual environments

```bash
sudo apt install python3.7-venv
```

Once the module is installed we are ready to create virtual environments for Python 3.

Switch to the directory where you would like to store your Python 3 virtual environments. Within the directory run the following command to create your new virtual environment:

```bash
python3.7 -m venv grapp-env
```
The command above creates a directory called `grapp-env`, which contains a copy of the Python binary, the Pip package manager, the standard Python library and other supporting files.

To start using this virtual environment, you need to activate it by running the activate script:

```bash
source grapp-env/bin/activate
```

Once activated, the virtual environment’s bin directory will be added at the beginning of the `$PATH` variable. Also your shell’s prompt will change and it will show the name of the virtual environment you’re currently using. In our case that is `grapp-env`


## Installing requirements.txt
All of the dependencies needed by grapp are stored in a `requirements.txt` file.
Run the following command to install them:

```bash
pip install -r /path/to/requirements.txt
```
## Running development server
After all of the dependencies are successfully installed, navigate to the main folder where settings.py resides

```bash
cd /path/to/main/main
```
Create a file named ".env" which will hold your environmental variables. Specify a Django secret key on the first line of the file.
```bash
SECRET_KEY=YOUR SECRET KEY
```
You can generate django secret keys by using free services like https://djecrety.ir or run this command to get a key

```bash
python3.7 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```
Navigate one level back and start development server

```bash
cd /path/to/main/
```
Run the following command to start development server at http://127.0.0.1:8000/

```bash
python manage.py runserver
```
## Create superuser
First we’ll need to create a user who can login to the admin site. Run the following command:

```bash
python manage.py createsuperuser
```

enter your desired username and press enter.

```bash
Username: admin
```
You will then be prompted for your desired email address:

```bash
Email address: admin@example.com
```
The final step is to enter your password. You will be asked to enter your password twice, the second time as a confirmation of the first.

```bash
Password: **********
Password (again): *********
Superuser created successfully.
```
Start development server
```bash
python manage.py runserver
```
And go to http://127.0.0.1:8000/admin to log in

