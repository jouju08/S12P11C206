import axios from 'axios';
import React from 'react';
import { Route, Router, useNavigate } from 'react-router-dom';

const FileInstance = axios.create({
  baseURL: 'http://192.168.100.136:8080/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default FileInstance;
