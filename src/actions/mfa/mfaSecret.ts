"use server";

var speakeasy = require("speakeasy");

export default async function MFASecret() {
  try {
    return speakeasy.generateSecret();
  } catch (error) {
    console.error(error);
  }
}
