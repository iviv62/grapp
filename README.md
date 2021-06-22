![Logo](http://www.grapp.ivelin.info/static/images/grapp-logo.png)

## Installing WSL on Windows OS

Grapp depends on linux to execute binary files. For this reason we would have to install Linux virtual machine or linux terminal environment. For simplicity we will use WSL. The  following link is to a installation guide.

[How to install Windows Subsystem for Linux (WSL)](https://www.windowscentral.com/install-windows-subsystem-linux-windows-10) 

## Installing Python 3.7 on Ubuntu with Apt(if not installed)
Installing Python 3.7 on Ubuntu with apt is a relatively straightforward process. Start WSL and run the following commands.


1. Start by updating the packages list and installing the prerequisites:
```bash
  sudo apt update
```

```bash
  sudo apt install software-properties-common
```
2. Next, add the deadsnakes PPA to your sources list:

```bash
  sudo add-apt-repository ppa:deadsnakes/ppa
```
When prompted press `Enter` to continue:

```bash
  Press [ENTER] to continue or Ctrl-c to cancel adding it.
```
3. Once the repository is enabled, install Python 3.7 with:

```bash
  sudo apt install python3.7
```
4. At this point, Python 3.7 is installed on your Ubuntu system and ready to be used. You can verify it by typing:

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
The next step is to extract main.rar to a folder of your choice. It holds all of grapp's source code. All of the dependencies needed by grapp are stored in a `requirements.txt` file.
run the following command to install them:

```bash
pip install -r /path/to/requirements.txt
```
## Running development server
After all of the dependencies are successfully installed, navigate to the main folder (if you haven't yet)

```bash
cd /path/to/main
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
