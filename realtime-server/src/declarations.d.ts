// This file is a fallback to prevent build errors if @types packages are missing
// ideally these should come from node_modules, but this suppresses the error
declare module 'express';
declare module 'jsonwebtoken';
declare module 'cors';
