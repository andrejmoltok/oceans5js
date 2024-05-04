"use server";

var speakeasy = require("speakeasy");

export default async function MFASecret() {
  try {
    const secretObj = speakeasy.generateSecret();
    return secretObj;
  } catch (error) {
    console.error(error);
  }
}
