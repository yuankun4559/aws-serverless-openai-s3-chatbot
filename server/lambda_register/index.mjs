// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import jwt from "jsonwebtoken";
// import bcryptjs from "bcryptjs";
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";

// const DEFAULT_REGION = "ap-northeast-1";
const TABLE_NAME = "chat_user_info";

const createToken = (username) => {
  return jwt.sign({ username: username }, process.env.TOKEN_KEY, {
    expiresIn: "24h",
  });
};

// const hashPassword = async (plaintextPassword) => {
//   const hash = await bcrypt.hash(plaintextPassword, 5); //It commonly ranges between 5 and 15. In this demo, we will use 5.
//   console.log(hash);
// };

// const comparePassword = async (plaintextPassword, hash) => {
//   const result = await bcrypt.compare(plaintextPassword, hash);
//   return result;
// };

const formatResponse = (code, errormsg, token, user) => {
  const response = {
    isAuthorized:(code === 200),
    body: {
      message: errormsg,
      token: token,
      user: user
    },
  };
  return response;
};

// 查询是否有重复用户
const queryDynamoDb = async (key) => {
  const client = new DynamoDBClient();
  const params = {
    Key: { username: { S: key } },
    TableName: TABLE_NAME,
  };
  const command = new GetItemCommand(params);
  try {
    const results = await client.send(command);
    console.log('DB 查询用户：', results);
    if (!results.Item) {
      // 数据库无重复用户，创建新用户
      return false;
    } else {
      return true
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

// 创建新用户
const createDynamoDb = async (name, pass) => {
  const client = new DynamoDBClient();
  const params = {
    Item: {
      username: {
        S: name
      },
      password: {
        S: pass
      },
    },
    TableName: TABLE_NAME,
  };
  const command = new PutItemCommand(params); // 插入单个用户到用户表
  try {
    const results = await client.send(command);
    console.log('DB 创建新用户：', results);
    return results
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const handler = async (event) => {
  //query user in DB
  const body = JSON.parse(event.body);
  console.log(body);
  const isRegistered = await queryDynamoDb(body.username);

  if (!isRegistered) {
    // 未注册
    const user = await createDynamoDb(body.username, body.password);
    const token = createToken(body.username);
    
    return formatResponse(200, "success", token , user);
  } else {
    // 已经注册
    return formatResponse(403, "The user has already registered", "", undefined);
  }
};
