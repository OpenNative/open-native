export const Home = () => {
  return (
    <flex>
      <webview
        javaScriptEnabled={true}
        source={{uri: 'https://nativescript.org'}}
        style={{
          backgroundColor: 'red',
        }}
      />
    </flex>
  );
};
