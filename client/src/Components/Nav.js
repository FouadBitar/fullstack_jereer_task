import React from 'react';

function Nav(props) {
  function logout() {
    props.auth.signOut().then(
      function () {
        // user signed out
      },
      (error) => {
        // could not sign out the user
      }
    );
  }
  return (
    <div>
      <nav>
        <ul>
          <button onClick={() => logout()}>logout</button>
        </ul>
      </nav>
    </div>
  );
}

export default Nav;
