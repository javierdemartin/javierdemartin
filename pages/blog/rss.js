

function RSS({ page, data }) {
    // Render data...
  }  

export async function getServerSideProps(context) {
    console.log("HEHEHE")
    const res = context.res;
    if (!res) {
      return;
    }
    // fetch your RSS data from somewhere here
    // const blogPosts = getRssXml(fetchMyPosts());
    res.setHeader("Content-Type", "text/xml");
    res.write("blogPosts");
    res.end();


  }
  
  export default RSS;