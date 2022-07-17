import buildClient from '../api/buildClient';

const LandingPage = ({ currentUser }) => {
    return currentUser ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>
}

// Called with the context object which has a req property with the http request
LandingPage.getInitialProps = async (context) => {
    console.log('LANDING PAGE!!');
    const client = buildClient(context)
    const { data } = await client.get('/api/users/currentuser')
    return data
}

export default LandingPage