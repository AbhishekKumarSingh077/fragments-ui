// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL ||'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user, expand=0) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=${expand}`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data', { data });
    return data.fragments;
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function sendData(user, fragType, fragmentVal){
  console.log('Sending Data to create a new Fragment');
  try{
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.idToken}`,
        'Content-Type': `${fragType}`,
      },
      body: `${fragmentVal}`,
    });
    if(!res.ok){
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Fragment has been successfully created', {data});
  }catch (err){
    console.log('Unable to call POST /v1/fragments ');
}
}

export async function getFragmentDataById(user, id) {
  console.log("Testing to get the Fragment data");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const headers = res.headers.get("content-type");
    var data;
    if(headers.includes("text/plain") || headers.includes("text/html") || headers.includes("text/markdown") || headers.includes("application/json")){
    console.log("Content-type", headers);
    data = await res.text();
    console.log("Got user fragments data", { data });
    return[data];
    }else{
      data = await res.blob();
      console.log("Got user fragments data", { data });
      return[data];
    }
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}


export async function getFragmentMetaDataById(user, id) {
  console.log("Testing to get the Fragment data!!!");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got user fragments data", { data });
    return data;
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

export async function deleteFragmentById(user, id) {
  console.log("Testing to delete the Fragment data");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Delete fragments data", { data });
    return data;
  } catch (err) {
    console.error("Unable to call DELETE /fragment", { err });
  }
}

export async function putFragment(user, id, fragType, putContent) {
  console.log("Testing PutFragment fragments data Function");
  try {
    console.log(fragType,);
    console.log(putContent);
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        "Content-Type": `${fragType}`,
      },
      body: `${putContent}`,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Put user fragments data", { data });
    return data;
  } catch (err) {
    console.error("Unable to call PUT /fragment", { err });
  }
}

