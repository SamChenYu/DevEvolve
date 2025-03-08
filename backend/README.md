## Steps to Run the Project

## Prerequisites
Make sure you have the following installed on your system:
- [Docker](https://www.docker.com/get-started/) (Not required if you start MySQL locally with configurations)
- [IntelliJ](https://www.jetbrains.com/idea/) (Not required but auto configures everything)
- [Git](https://git-scm.com/)
- Java Version 17 or Later

1. **Navigate to the project directory**
```sh
cd DevEvolve/backend
```

2. **Start Docker Compose to run MySQL instance**
```sh
docker-compose up
```

3. **Start the development server with IntelliJ**
- Load Maven Dependencies
- Select JDK (17 or later)
- Select SweFreelanceApplication.java as main class
- Run development server
- Wait for 'Backend server running ...' to print in console


Backend Accessible through localhost:8081  
Docker MySQL instance accessible through localhost:3306  
Docker MySQL PHP MyAdmin accessible through localhost:8081:80  

3. **Stop Docker Compose When Finished**
```sh
docker-compose down
```


