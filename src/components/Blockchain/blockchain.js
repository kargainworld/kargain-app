import { Fab, Grid, Typography } from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import { connectorNames, connectorTypes } from '../../constants';
import useStyles from './styles';

const Blockchain = ({ values, setValues }) => {
    const context = useWeb3React();
    const classes = useStyles();
    const [activeConnector, setActiveConnector] = useState();
    const [blockNumber, setBlockNumber] = useState();
    const [balance, setBalance] = useState();

    const {
        library,
        account,
        activate,
        connector,
        chainId,
        deactivate
    } = context;

    useEffect(() => {
        if (library) {
            let stale = false;

            library.eth
                .getBlockNumber()
                .then(r => {
                    if (!stale) {
                        setBlockNumber(r);
                    }
                })
                .catch(e => {
                    console.log(e);
                    if (!stale) {
                        setBlockNumber(null);
                    }
                });
            return () => {
                stale = true;
                setBlockNumber(null);
            };
        }
    }, [library, chainId]);

    useEffect(() => {
        if (library && account) {
            let stale = false;

            library.eth
                .getBalance(account)
                .then(r => {
                    if (!stale) {
                        setBalance(library.utils.fromWei(r, 'ether'));
                    }
                })
                .catch(() => {
                    if (!stale) {
                        setBalance(null);
                    }
                });

            return () => {
                stale = true;
                setBlockNumber(null);
            };
        }
    }, [library, account, chainId]);

    const handleChange = prop => event => {
        if (connector) {
            deactivate(connector);
        }
        setValues({ ...values, [prop]: event.target.value });
    };

    const signMessage = () => {
        library.eth.personal.sign('Hello Terminal!', account).then(console.log);
    };

    const getBlockNumber = () => {
        library.eth.getBlockNumber().then(console.log);
    };

    return (
        <div className={classes.root}>
            <div className={classes.appContainer}>
                <div className={classes.contentContainer}>
                    <div className={classes.connectorInfoContainer}>
                        <Typography className={classes.info}>
                            ChainId: {chainId || 'None'}
                        </Typography>
                        <Typography className={classes.info}>
                            Account: {account || 'None'}
                        </Typography>
                        <Typography className={classes.info}>
                            Block Number: {blockNumber || 'None'}
                        </Typography>
                        <Typography className={classes.info}>
                            Balance: {balance || 'None'}
                        </Typography>
                    </div>
                    <div className={classes.optionsContainer}>
                        {Object.keys(connectorTypes).map(con => {
                            const current = connectorTypes[con];
                            let disabled = current === connector;
                            const name = connectorNames[con];

                            // disable this if MM is not installed
                            if (name === connectorNames['Injected'] && !window.ethereum) {
                                disabled = true;
                            }

                            return (
                                <Grid item sm={4} key={con}>
                                    <Fab
                                        key={con}
                                        onClick={() => {
                                            setActiveConnector(current);
                                            activate(connectorTypes[con]);
                                        }}
                                        disabled={disabled}
                                        className={classes.optionButton}
                                    >
                                        <div className={classes.optionButton}>{name}</div>
                                    </Fab>
                                </Grid>
                            );
                        })}
                    </div>
                    <div className={classes.signButtonContainer}>
                        <Fab
                            className={classes.optionButton}
                            disabled={!activeConnector || !account}
                            onClick={() => signMessage()}
                        >
                            <div className={classes.optionButton}>Sign Message</div>
                        </Fab>
                    </div>
                    <div className={classes.signButtonContainer}>
                        <Fab
                            className={classes.optionButton}
                            disabled={!activeConnector}
                            onClick={() => getBlockNumber()}
                        >
                            <div className={classes.optionButton}>Get Block Number</div>
                        </Fab>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blockchain;
