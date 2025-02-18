export default async function Page() {
  fetch("https://dummyjson.com/carts")
    .then((res) => res.json())
    .then((json) => console.log(json));
  return (
    <ul>
      {/* {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))} */}
      {json.map((mappedItem) => {
        <li></li>;
      })}
    </ul>
  );
}
