import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
    root: {
        backgroundColor: "white",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        margin: 0,
        position: "absolute",
        padding: 0,
        height: "100%",
        minHeight: 980,
        minWidth: "100%",
        top: 0,
        left: 0
    },
    appContainer: {
        width: "100%",
        display: "flex",
        alignContent: "center",
        justifyContent: "center"
    },
    contentContainer: {
        width: 725,
        minWidth: 725,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: "3%"
    },
    title: {
        fontFamily: "Nunito Sans",
        letterSpacing: 1.2,
        fontSize: 44,
        fontWeight: 235,
        marginTop: 35
    },
    optionsContainer: {
        marginTop: 45,
        display: "grid",
        gridGap: "3rem",
        gridTemplateColumns: "1fr 1fr",
        maxWidth: 500,
        margin: "auto"
    },
    optionButton: {
        borderRadius: 16,
        width: 150
    },
    connectorInfoContainer: {
        marginTop: 12
    },
    inputsContainer: {
        marginTop: 45,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    signButtonContainer: {
        marginTop: 35
    },
    input: {
        marginTop: 15
    },
    info: {
        fontFamily: "Nunito Sans",
        letterSpacing: 1,
        fontSize: 18,
        marginTop: 15
    },
    githubIcon: {
        position: "absolute",
        top: 25,
        right: 190
    },
    twitterIcon: {
        position: "absolute",
        top: 25,
        right: 135
    },
    mediumIcon: {
        position: "absolute",
        top: 25,
        right: 80
    },
    terminalIcon: {
        position: "absolute",
        top: 25,
        right: 25
    }
});

export default useStyles;
