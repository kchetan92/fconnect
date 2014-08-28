var nodes = [];
    var edges = [];
    var network = null;
	var relatives, me, distant = [];
	var count = 0, relCount = 0;
	var color = '#BFBFBF';
  function statusChangeCallback(response) {
   if (response.status === 'connected') {
     FB.api(
      "/me/family",
      function (response) {
        if (response && !response.error) {
			relatives = response.data;
			for(var i in relatives)
			{
				getPic(relatives[i], relatives.length, 1, relatives[i].relationship, 5);
				getRelatives(relatives[i]);
			}
		}
      }
      );
      FB.api(
        "/me/picture",
        function (response) {
        if (response && !response.error) {
        /* handle the result */
        me = response.data.url;
		nodes.push({id: ++count, value: 2, label: 'Me',   image: response.data.url, shape: 'image'});
       }
      }
     );
   }
 }
 
 function getPic(rel, length, frm, relation, width)
 {
		FB.api(
        "/"+rel.id+"/picture",
        function (response) {
        if (response && !response.error) {
        /* handle the result */
        rel.pic = response.data.url;
		console.log(parseInt(rel.id));
		nodes.push({id: parseInt(rel.id), value: 1, label: rel.name+"\n"+relation,  image:response.data.url , shape: 'image'});
		edges.push( {from: parseInt(frm),   to: parseInt(rel.id), length: 300, width: width,  color: color});
		relCount++;
       }
	   if(relCount == length)
		relCount = 0;
		draw();
      }
     );
 }
 
 function getRelatives(rel)
 {
	FB.api(
      "/"+rel.id+"/family",
      function (response) {
        if (response && !response.error) {
          //console.log(typeof(response.data));
		  if(response.data.length>0)
			for(var i in response.data)
			{
				distant.push(response.data);
				getPic(response.data[i], response.data.length, rel.id, rel.relationship+"'s "+response.data[i].relationship, 1);
			}
        }
      });
 }
 
 
 window.fbAsyncInit = function() {
  FB.init({
    appId      : '1462953143955008',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.1' // use version 2.1
  });

  
  FB.login(function(response) {
  }, {scope: 'user_relationships'});

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  

};
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


   

    function draw() {

      // create a network
      var container = document.getElementById('mynetwork');
      var data = {
        nodes: nodes,
        edges: edges
      };
      var options = {
        nodes: {
          widthMin: 40,  // min width in pixels
          widthMax: 100  // max width in pixels
        }
      };
	  container.innerHTML = "";
      network = new vis.Network(container, data, options);
    }