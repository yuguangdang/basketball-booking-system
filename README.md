<h3>Project Overview</h3>

This is a private project used for my basketball club members to register and pay for the basketball session they attend.

I run a local basketball club and I block book a sports hall with a local school. The booking fee is shared among attendants for each game. However, the number of attendants varies each time and keeping checking everyone's payment is a pain in the neck. So I developed this web app to automatically calculate the fee based on the number of attendants and mark the ones who have made the payment. It saves me a lot time and helps me manage the basketball club more effectively.

The system was built with NodeJS, Express and MongoDB. The payment process was implemented using Stripe API.

<h3>Project Screenshots</h3>
<ul>
  <img width="600" alt="QQ20230202-152138@2x" src="https://user-images.githubusercontent.com/55920971/216239373-69d466c2-e8f6-4f60-943a-637dd69b6e1e.png">
  <img width="600" alt="QQ20230202-152155@2x" src="https://user-images.githubusercontent.com/55920971/216239399-8df7431b-ea2b-466d-9e4e-82aaed03c45e.png">
  <img width="600" alt="QQ20230202-152523@2x" src="https://user-images.githubusercontent.com/55920971/216239409-c5cd8b10-c925-4024-826b-aeea470c7efe.png">
  <img width="600" alt="QQ20230202-152749@2x" src="https://user-images.githubusercontent.com/55920971/216239527-353b4291-02bf-4efc-a3bf-6b7db2ce45fa.png">
  <img width="600" alt="QQ20230202-152833@2x" src="https://user-images.githubusercontent.com/55920971/216239585-8673fa6d-035f-4b10-a02d-4beaf9f4bde9.png">
</ul>

<h3>Database design</h3>

There are two main objects, Player and Game. Below is the player schema.

<ul>
  <img width="170" height="400" alt="QQ20230202-153031@2x" src="https://user-images.githubusercontent.com/55920971/227763249-aaebe538-a3d3-4c11-9368-e1ce99fb4dff.png">
  <img width="430" height="400" alt="QQ20230202-153057@2x" src="https://user-images.githubusercontent.com/55920971/216240014-259dc0dc-bf5d-4744-a9f7-0d38b0100b16.png">
</ul>

Below is the game schema
<ul>
  <img width="170" height="400" alt="QQ20230202-153031@2x" src="https://user-images.githubusercontent.com/55920971/227761884-40cf0973-b485-445c-bb30-660ba4dc414c.png">
  <img width="430" height="400" alt="QQ20230202-153057@2x" src="https://user-images.githubusercontent.com/55920971/227762272-62f18d12-c6bd-4184-b80f-a25193a70308.png">


