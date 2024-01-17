<div id="top"></div>
<br />
<div align="center">
  <h3 align="center">Paperwork server</h3>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>

## About The Project
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Paperwork-EIP_Server&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Paperwork-EIP_Server)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Paperwork-EIP_Server&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Paperwork-EIP_Server)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Paperwork-EIP_Server&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Paperwork-EIP_Server)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Paperwork-EIP_Server&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Paperwork-EIP_Server)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Paperwork-EIP_Server&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Paperwork-EIP_Server)

Paperwork is a web and mobile platform, aiming to help and guide non-French speaker in their administrative process in France. Through our various functionalities, they will be able to determine which documents or appointments they will need for the necessary administrative procedures depending on their situation and the spoken language.

## Getting Started

### Installation

You can clone the repo by entering:
   ```sh
   git clone git@github.com:Paperwork-EIP/Server.git
   ```

## Usage

You will need to add your .env file with this values corresponding to your own environment(jwt_key, EMAIL, AWS_DEFAULT_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY).
The server will start at https://localhost:8282, the swagger documentation is accessible here : https://paperwork-eip.github.io/doc-api-server/
```sh
  docker-compose up --build serverLocal
  docker-compose up --build test
```
<p align="right">(<a href="#top">back to top</a>)</p>
