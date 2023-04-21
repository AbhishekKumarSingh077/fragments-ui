// src/app.js

import { Auth, getUser } from './auth';
import { getUserFragments, sendData, getFragmentDataById, getFragmentMetaDataById, deleteFragmentById, putFragment } from './api';
var user;
async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const createFragment = document.querySelector('#create-fragment');
  const fragmentText = document.querySelector('#text-input-title');
  const checkOldFragment = document.querySelector('#checkOldFragment');
  const checkOldFragmentBtn = document.querySelector('#checkOldFragmentBtn');
  const checkOldFragmentList = document.querySelector('#checkOldFragmentList');
  const fragType = document.querySelector('#Type');
  const uploadedImg = document.querySelector("#image");
  const getFragDataByID = document.querySelector("#getFragDataByID");
  const getDataByID = document.querySelector("#getDataByID");
  const frag_content = document.querySelector("#frag_byID");
  const getFragMeta = document.querySelector("#getFragMeta");
  const deleteFragment = document.querySelector("#deleteFragBtn");
  const deleteFragId = document.querySelector("#id_delete");
  const deleteInfo = document.querySelector("#deleteInfo");
  const putFragmentBtn = document.querySelector("#updateDataBtn");
  const putID = document.querySelector("#IdUpdate");
  const putContent = document.querySelector("#UpdateFragData");
  const updateInfo = document.querySelector("#updateInfo");
  const createInfo = document.querySelector("#createInfo");
  const updateType = document.querySelector("#updateType");

  checkOldFragmentBtn.onclick = () => {
    testFragments();
  }


  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }else{
    testFragments();
  }

  createFragment.onclick = () =>{
    if(fragType.options[fragType.selectedIndex].value == "text/plain" ||
    fragType.options[fragType.selectedIndex].value == "text/markdown" ||
    fragType.options[fragType.selectedIndex].value == "text/html" ||
    fragType.options[fragType.selectedIndex].value == "application/json"){
      sendData(user, fragType.options[fragType.selectedIndex].value, fragmentText.value);
      createInfo.innerHTML = "Fragment has been created";
    }else{
      sendData(user, fragType.options[fragType.selectedIndex].value, uploadedImg.files);
      createInfo.innerHTML = "Fragment has been created";
    }
    //sendData(user, fragmentText.value, fragType.value);
  }

  getFragDataByID.onclick = async () =>{
    var res = await getFragmentDataById(user, getDataByID.value);
    console.log(res);
    frag_content.innerHTML = res;
  }

  getFragMeta.onclick = async () =>{
    var res = await getFragmentMetaDataById(user, getDataByID.value);
    console.log(res);
    frag_content.innerHTML = JSON.stringify(res);
  }

  deleteFragment.onclick = async () =>{
    deleteFragmentById(user, deleteFragId.value);
    deleteInfo.innerHTML = "Fragment with ID: " + deleteFragId.value + " has been deleted";
  }

  putFragmentBtn.onclick = async () =>{
    putFragment(user, putID.value, updateType.options[updateType.selectedIndex].value, putContent.value);
    updateInfo.innerHTML = "Fragment with ID: " + putID.value + " has been updated";
  }

  // Do an authenticated request to the fragments API server and log the result
  getUserFragments(user);

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;
}

function testFragments() {
  let oldFragment = "";
  let checkOldFragmentList = document.querySelector(".checkOldFragmentList");
  checkOldFragmentList.innerHTML = "";
  getUserFragments(user).then((data) => {
    if (data.length) {
      let addUpper = document.createElement("tr");
      let upperHeadingRow = [
        "ID",
        "Created",
        "Updated",
        "Type"
      ];
      for (let fragmentsColumn of upperHeadingRow) {
        let th = document.createElement("th");
        th.append(fragmentsColumn);
        addUpper.appendChild(th);
      }
      checkOldFragmentList.appendChild(addUpper);
      for (let fragment of data) {
        let tr = document.createElement("tr");
        let id = document.createElement("td");
        let created = document.createElement("td");
        let updated = document.createElement("td");
        let type = document.createElement("td");
        id.append(fragment.id);
        created.append(fragment.created);
        updated.append(fragment.updated);
        type.append(fragment.type);
        tr.append(id, created, updated, type);
        checkOldFragmentList.appendChild(tr);
      }
    } else {
      let td = document.createElement("td");
      td.append("There exist no fragments!!");
      checkOldFragmentList.append(td);
    }
  });
  checkOldFragmentList.html = oldFragment;
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);

