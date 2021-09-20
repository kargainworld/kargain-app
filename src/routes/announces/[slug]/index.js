import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { Col, Container, Row } from 'reactstrap';
import Alert from '@material-ui/lab/Alert';
import { useWeb3React } from '@web3-react/core';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTranslation from 'next-translate/useTranslation';
import GalleryViewer from '../../../components/Gallery/GalleryViewer';
import Comments from '../../../components/Comments/Comments';
import TagsList from '../../../components/Tags/TagsList';
import CTALink from '../../../components/CTALink';
import { Action } from '../../../components/AnnounceCard/components';
import AnnounceService from '../../../services/AnnounceService';
import AnnounceModel from '../../../models/announce.model';
import { MessageContext } from '../../../context/MessageContext';
import { ModalContext } from '../../../context/ModalContext';
import { useAuth } from '../../../context/AuthProvider';
import { getTimeAgo } from '../../../libs/utils';
import Error from '../../_error';
import * as i from '@material-ui/icons';
import useKargainContract from 'hooks/useKargainContract';
import TextField from '@material-ui/core/TextField';
import usePriceTracker from 'hooks/usePriceTracker';
import Box from '@material-ui/core/Box';
import { NewIcons } from 'assets/icons';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { injected } from '../../../connectors';
import UsersService from '../../../services/UsersService';
import Web3 from 'web3';
import TransactionsService from '../../../services/TransactionsService';
import MakeOffer from "../../../components/Blockchain/MakeOffer";
import HandleOffer from "../../../components/Blockchain/HandleOffer";
import ClickLikeButton from "../../../components/Likes/ClickLikeButton";
import SharedURL from "../../../components/AnnounceCard/SharedURL";
import CardInformation from "../../../components/AnnounceCard/CarInformation";
import EditLikeAndComments from "../../../components/AnnounceCard/EditLikeAndComments"
import VehicleEquipments from "../../../components/AnnounceCard/VehicleEquipments"

const web3 = new Web3(Web3.givenProvider);

const useStyles = makeStyles(() => ({
  priceStarsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    margin: '15px 0',
    borderBottom: '1px solid #999999',
  },
  wysiwyg: {
    margin: '1rem',
  },
  buttonblue: {
    display: 'flex !important',
    flexDirection: 'row !important',
    justifyContent: 'center !important',
    alignItems: 'center !important',
    padding: '6px 50px !important',

    background: '#2C65F6 !important',
    borderRadius: '25px !important',

    fontWeight: 'bold !important',
    fontSize: '14px !important',
    lineHeight: '150% !important',
    color: 'white !important',

    marginTop: '25px !important',
  },

  filtersHidden: {
    display: 'none',
  },

  textfield: {
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& input:disabled': {
      backgroundColor: '#d5d8db',
      height: '5px',
    },
  },
  textfieldcustom: {
    '& span': {
      display: 'none',
    },
    '& fieldset': {
      borderColor: '#999999 !important',
    },
    '& .MuiInputBase-root': {
      height: '30px',
    },
  },
}));

const Announce = () => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [hiddenForm, hideForm] = useState(true);

  const toggleFilters = () => {
    hideForm((hiddenForm) => !hiddenForm);
  };

  useEffect(() => {
    toggleFilters();
  }, [isMobile]);

  const { library, chainId, account, activate, active } = useWeb3React();
  const [bnbBalance, setBalance] = useState();
  const [bnbBalanceWei, setBalanceWei] = useState();
  const refImg = useRef();
  const classes = useStyles();
  const router = useRouter();
  const { slug } = router.query;
  const { t, lang } = useTranslation();
  const { isAuthenticated, authenticatedUser, setForceLoginModal } = useAuth();
  const { dispatchModal, dispatchModalError } = useContext(MessageContext);
  const { dispatchModalState } = useContext(ModalContext);
  const { getPriceTracker } = usePriceTracker();
  const [priceBNB, setPrice] = useState(0);
//   const [bnbBalance, setBalance] = useState()
  const [walletPayer, setWalletPayer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenPrice, setTokenPrice] = useState(null);
  const [error, setError] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(true);
  const [isMinted, setIsMinted] = useState(false);
  const tokenPriceInEuros = (+tokenPrice * priceBNB).toFixed(2);

  const web3 = new Web3(Web3.givenProvider)
  const {
    fetchTokenPrice,
    mintToken,
    updateTokenPrince,
    makeOffer,
    isContractReady,
    watchOfferEvent,
    acceptOffer,
    rejectOffer,
    waitTransactionToBeConfirmed,
  } = useKargainContract();

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true)
          .then(() => {})
          .catch((err) => {
            console.log('err', err);
            setTried(true);
          });
      } else {
        setTried(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!state.stateReady) return;
    if (!state?.announce?.getID) return;

    const action = async () => {
      const transactions = await TransactionsService.getTransactionsByAnnounceId(state?.announce?.getID);
      setTransactions(transactions);
    };

    action();
  }, [state, transactions?.length]);

  useEffect(() => {
    if (!state?.announce?.getID) return;

    const action = async () => {
      const transactionsPending = transactions.filter((x) => x.status === 'Pending');

      console.log('transactionsPending', transactionsPending);

      for (const tx of transactionsPending) {
        try {
          await waitTransactionToBeConfirmed(tx.hashTx);

          const newTx = await TransactionsService.updateTransaction(state?.announce?.getID, {
            hashTx: tx.hashTx,
            status: 'Approved',
          });

          setTransactions((prev) => {
            const result = prev.filter((x) => x.hashTx === tx.hashTx);

            result.push(newTx);

            return result;
          });
        } catch (error) {
          const newTx = await TransactionsService.updateTransaction(state?.announce?.getID, {
            hashTx: tx.hashTx,
            status: 'Rejected',
          });

          setTransactions((prev) => {
            const result = prev.filter((x) => x.hashTx === tx.hashTx);

            result.push(newTx);

            return result;
          });
        }
      }
    };

    action();
  }, [state, transactions, waitTransactionToBeConfirmed]);

  const fetchProfile = useCallback(async () => {
    if (!isContractReady || !walletPayer) return;

    try {
      const result = await UsersService.getUsernameByWallet(walletPayer);
      return result;
    } catch (e) {
      console.log(e);
    }
  }, [walletPayer, isContractReady, isContractReady]);

  const [state, setState] = useState({
    err: null,
    stateReady: false,
    isSelf: false,
    isAdmin: false,
    announce: new AnnounceModel(),
  });

  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (!isContractReady) return;

    if (!!account && !!library) {
      let stale = false;

      web3.eth
        .getBalance(account)
        .then((balance) => {
          if (!stale) {
            let ethBalance = web3.utils.fromWei(balance, 'ether');
            setBalance(ethBalance);
            setBalanceWei(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null);
          }
        });

      return () => {
        stale = true;
        setBalance(undefined);
      };
    }
  }, [account, library, chainId, isContractReady]); //

  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  const [transactions, setTransactions] = useState([]);

  const transactionsOrdered = transactions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const tokenMinted = transactionsOrdered.find((x) => x.action === 'TokenMinted');

  const offerAccepted = transactionsOrdered.filter((x) => x.action === 'OfferAccepted');
  const offerRejected = transactionsOrdered.filter((x) => x.action === 'OfferRejected');

  const newOfferCreated = transactionsOrdered.find(
    (x) =>
      x.action === 'OfferCreated' &&
      !offerAccepted.some((y) => y.data === x.hashTx && ['Approved', 'Pending'].includes(y.status)) &&
      !offerRejected.some((y) => y.data === x.hashTx && ['Approved', 'Pending'].includes(y.status))
  );

  console.log({
    tokenMinted,
    newOfferCreated,
    offerAccepted,
    offerRejected,
    transactions,
  });

  const handleApplyPriceChange = async () => {
    const tokenId = state?.announce?.getTokenId;
    const announceId = state?.announce?.getID;

    setIsConfirmed(false);
    setError(null);

    try {
      const task = !isMinted ? mintToken(tokenId, +tokenPrice) : updateTokenPrince(tokenId, +tokenPrice);

      const hashTx = await task;

      const result = await TransactionsService.addTransaction({
        announceId,
        hashTx,
        data: tokenPrice,
        action: 'TokenMinted',
      });

      setTransactions((prev) => [...prev, result]);

      await waitTransactionToBeConfirmed(hashTx);

      setIsConfirmed(true);
      setIsMinted(true);
      dispatchModal({ msg: t('vehicles:tokenPriceConfirmed') });
    } catch (error) {
      console.error(error);
      setError(error);
      setIsConfirmed(true);
    }
  };

  useEffect(() => {
    if (!isContractReady)
        return

    if (!!account && !!library) {
        let stale = false

        web3.eth
            .getBalance(account)
            .then((balance) => {
                if (!stale) {
                    let ethBalance = web3.utils.fromWei(balance, 'ether')
                    setBalance(ethBalance)
                }
            })
            .catch(() => {
                if (!stale) {
                    setBalance(null)
                }
            })

        return () => {
            stale = true
            setBalance(undefined)
        }
    }
}, [account, library, chainId, isContractReady])

  const isOwn = authenticatedUser?.raw?._id === state?.announce?.raw?.user?._id;

  const toggleVisibility = () => {
    AnnounceService.updateAnnounce(state?.announce?.getSlug, { visible: !state?.announce?.raw?.visible }).then(() =>
      window.location.reload()
    );
  };

  const fetchAnnounce = useCallback(async () => {
    try {
      const result = await AnnounceService.getAnnounceBySlug(slug);
      const { announce, isAdmin, isSelf } = result;
      const newAnnounce = new AnnounceModel(announce);
      const transactions = await TransactionsService.getTransactionsByAnnounceId(newAnnounce.getID);

      setTransactions(transactions);
      setState((state) => ({
        ...state,
        stateReady: true,
        announce: newAnnounce,
        isAdmin,
        isSelf,
      }));
    } catch (err) {
      setState((state) => ({
        ...state,
        stateReady: true,
        err,
      }));
    }
  }, [slug]);

  useEffect(() => {
    if (!isContractReady || !state?.announce.getTokenId) return;

    const handleOfferReceived = async () => {
      try {
        const data = await watchOfferEvent(state?.announce.getTokenId);

        setWalletPayer(data);
      } catch (error) {
        setError(error);
      }
    };

    handleOfferReceived();
  }, [isContractReady, state?.announce, watchOfferEvent]);

  useEffect(() => {
    if (!isContractReady || !state?.announce.getTokenId) return;

    fetchAnnounce();
    if (walletPayer) {
      fetchProfile();
    }
  }, [fetchAnnounce, fetchProfile]);

  useEffect(() => {
    if (!state.stateReady) return;

    setIsLoading(true);

    const tokenId = state.announce.getTokenId;
    getPriceTracker().then((price) => {
      setPrice(price.quotes.EUR.price);
    });

    fetchTokenPrice(tokenId)
      .then((price) => {
        setTokenPrice(price);
        setIsLoading(false);
        setIsMinted(price ? true : false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [state, fetchTokenPrice]);

  if (!state.stateReady) return null;
  if (state.err) return <Error statusCode={state.err?.statusCode} />;

  console.log('pererere', !isOwn && isMinted && !newOfferCreated && authenticatedUser.getWallet);

  return (
    <Container>
      <NextSeo title={`${state?.announce?.getTitle} - Kargain`} description={state?.announce?.getTheExcerpt()} />

      {state.isAdmin && (
        <Alert severity="info" className="mb-2">
          Connected as Admin
        </Alert>
      )}

      <div className="objava-wrapper">
        <Row>
          {isMobile ? (
            <Col sm={12} md={6}>
                <CardInformation announce={state.announce} />
                <div>
                  <Typography as="h2" variant="h2" style={{ fontWeight: '500', fontSize: '24px', lineHeight: '150%' }}>
                    {state?.announce?.getAnnounceTitle}
                  </Typography>

                  <div style={{ width: '100%', marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <Box mb={2} display="flex" flexDirection="row">
                      <Col sm={3}>
                        <Row style={{ marginTop: '10px' }}>
                          <label key={`price-${tokenPriceInEuros}`} style={{ fontSize: 16, color: '#444444' }}>
                            € <label style={{ fontSize: 14, color: '#444444' }}>{tokenPriceInEuros}</label>
                          </label>
                        </Row>
                      </Col>
                    </Box>

                    <Box mb={2} display="flex" flexDirection="row-reverse">
                      <Col
                        sm={3}
                        className="icons-star-prof"
                        onClick={() =>
                          dispatchModalState({
                            openModalShare: true,
                            modalShareAnnounce: state?.announce,
                          })
                        }
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <small className="mx-3" style={{ fontSize: '16px' }}>
                          {' '}
                          {getTimeAgo(state?.announce?.getCreationDate.raw, lang)}
                        </small>
                        <img src="/images/share.png" alt="" />
                      </Col>
                    </Box>
                  </div>

                  <div>
                    <p style={{ fontStyle: 'normal', fontWeight: '500', fontSize: '14px', lineHeight: '150%' }}>
                      #1212
                    </p>
                  </div>
                </div>

                <div className="pics">
                  {state?.announce?.getCountImages > 0 && (
                    <GalleryViewer images={state?.announce?.getImages} ref={refImg} />
                  )}
                </div>

                {isOwn && isMinted && newOfferCreated && newOfferCreated.status === 'Pending' && (
                  <div>offer pending, wait a few minutes to be confirmed.</div>
                )}

                {isOwn && isMinted && newOfferCreated && newOfferCreated.status === 'Approved' && (
                  <Row style={{ justifyContent: 'center', marginTop: '30px' }}>
                    <HandleOffer newOfferCreated={newOfferCreated} announce={state.announce} tokenPrice={tokenPrice} />
                  </Row>
                )}

                {!isOwn && isMinted && !newOfferCreated && authenticatedUser.getWallet && (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <MakeOffer tokenPrice={tokenPrice} announce={state.announce} bnbBalance={bnbBalance} />
                  </div>
                )}

                <div style={{ marginTop: '25px' }}>
                  <p style={{ fontStyle: 'normal', fontWeight: '500', fontSize: '14px', lineHeight: '150%' }}>#1212</p>
                </div>

                <TagsList tags={state?.announce?.getTags} />

                <div className={clsx('price-stars-wrapper', classes.priceStarsWrapper)} style={{ marginTop: '-15px' }}>
                  <div style={{ width: '90%', display: 'flex', marginBottom: 10 }}>
                    {isOwn && (
                      <Action onClick={toggleVisibility}>
                        {state?.announce?.getIsVisible ? <i.VisibilityOutlined /> : <i.VisibilityOffOutlined />}
                      </Action>
                    )}

                    <ClickLikeButton authenticatedUser={authenticatedUser} announce={state.announce}  />
                    <Action
                      title={t('vehicles:comment_plural')}
                      style={{
                        color: state?.announce?.getCountComments > 0 ? '#FE74F1' : '#444444',
                        marginLeft: '10px',
                      }}
                    >
                      <NewIcons.card_message_pink style={{ width: 23, marginRight: '8px' }} />
                      <span>{state?.announce?.getCountComments}</span>
                    </Action>

                    <Action
                      onClick={() => {
                        if (!isAuthenticated) {
                          router.push({
                            pathname: '/auth/login',
                            query: { redirect: router.asPath },
                          });
                          return;
                        }
                        dispatchModalState({
                          openModalMessaging: true,
                          modalMessagingProfile: state?.announce?.getAuthor,
                          modalMessaginAnnounce: state.announce,
                        });
                      }}
                      style={{
                        color: state?.announce?.getCountComments > 0 ? '#444444' : '#444444',
                        marginLeft: '10px',
                      }}
                    >
                      <i.MailOutline style={{ position: 'relative', top: -1 }} />
                    </Action>

                    {(state.isAdmin || state.isSelf) && (
                      <div style={{ display: 'flex', gap: 5 }}>
                        <CTALink href={state?.announce?.getAnnounceEditLink} title={t('vehicles:edit-announce')} />
                      </div>
                    )}
                  </div>

                  <div
                    onClick={() => toggleFilters()}
                    style={{ width: '10%', display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <i className={clsx('ml-2', 'arrow_nav', hiddenForm ? 'is-left' : 'is-bottom')} />
                  </div>
                </div>

                {!isOwn && (
                  <div className={clsx(hiddenForm && classes.filtersHidden)}>
                    <Comments announceRaw={state?.announce?.getRaw} />
                  </div>
                )}

                {isOwn && (
                  <div
                    className={clsx('price-stars-wrapper', classes.priceStarsWrapper)}
                    style={{ borderBottom: '1px solid #ffffff' }}
                  >
                    <div>
                      {!isLoading && (
                        <div style={{ display: 'flex' }}>
                          <div className={clsx(classes.textfieldcustom)}>
                            <p style={{ fontSize: '12px', color: '#999999', marginBottom: '10px' }}>
                              {t('vehicles:tokenPrice')} :{' '}
                            </p>
                            <TextField
                              onChange={(event) => setTokenPrice(event.target.value)}
                              value={tokenPrice}
                              type="number"
                              InputLabelProps={{ shrink: true }}
                              error={!!error}
                              helperText={error ? error.message : !isConfirmed && t('vehicles:waitingConfirmation')}
                              disabled={!isConfirmed || !active}
                              variant="outlined"
                            />
                          </div>
                          <button
                            className={clsx(classes.buttonblue)}
                            style={{ height: '40px', marginLeft: '10px' }}
                            disabled={!isConfirmed || !tokenPrice || !active}
                            onClick={handleApplyPriceChange}
                          >
                            {isMinted ? t('vehicles:save') : t('vehicles:mint')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              
            </Col>
          ) : (
            <>
              <CardInformation announce={state.announce} />
              <Col sm={12} md={6}>
                <div style={{ marginTop: '25px' }}>
                  <Typography as="h2" variant="h2" style={{ fontWeight: '500', fontSize: '24px', lineHeight: '150%' }}>
                    {state?.announce?.getAnnounceTitle}
                  </Typography>

                  <div style={{ width: '100%', marginTop: '10px' }}>
                    <div style={{ width: '100%', marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                      <Box mb={2} display="flex" flexDirection="row">
                        <Col sm={12}>
                          <Row>
                            <label key={`price-${tokenPriceInEuros}`} style={{ fontSize: 28, color: '#444444' }}>
                              € <label style={{ fontSize: 24, color: '#444444' }}>{tokenPriceInEuros}</label>
                            </label>
                          </Row>
                        </Col>
                      </Box>

                      <Box mb={5} display="flex" flexDirection="row-reverse">
                        <Col
                          className="icons-star-prof"
                          onClick={() =>
                            dispatchModalState({
                              openModalShare: true,
                              modalShareAnnounce: state?.announce,
                            })
                          }
                          style={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                          <small className="mx-3" style={{ fontSize: '16px' }}>
                            {' '}
                            {getTimeAgo(state?.announce?.getCreationDate.raw, lang)}
                          </small>
                          <img src="/images/share.png" alt="" />
                        </Col>
                      </Box>
                    </div>
                  </div>

                  <div>
                    <p style={{ fontStyle: 'normal', fontWeight: '500', fontSize: '14px', lineHeight: '150%' }}>
                      #1212
                    </p>
                  </div>
                </div>

                {isOwn && isMinted && newOfferCreated && newOfferCreated.status === 'Pending' && (
                  <div>offer pending, wait a few minutes to be confirmed.</div>
                )}

                {isOwn && isMinted && newOfferCreated && newOfferCreated.status === 'Approved' && (
                  <Row style={{ justifyContent: 'center', marginTop: '30px' }}>
                     <HandleOffer newOfferCreated={newOfferCreated} announce={state.announce} tokenPrice={tokenPrice} />
                  </Row>
                )}

                {!isOwn && isMinted && !newOfferCreated && authenticatedUser.getWallet && (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <MakeOffer tokenPrice={tokenPrice} announce={state.announce} bnbBalance={bnbBalance} />
                  </div>
                )}

                <TagsList tags={state?.announce?.getTags} />

                <div className={clsx('price-stars-wrapper', classes.priceStarsWrapper)} style={{ marginTop: '-15px' }}>
                  <div className="icons-profile-wrapper" style={{ width: '90%' }}>
                    {isOwn && (
                      <Action onClick={toggleVisibility}>
                        {state?.announce?.getIsVisible ? <i.VisibilityOutlined /> : <i.VisibilityOffOutlined />}
                      </Action>
                    )}

                    <ClickLikeButton authenticatedUser={authenticatedUser} announce={state.announce}  />

                    <Action
                      title={t('vehicles:comment_plural')}
                      style={{
                        color: state?.announce?.getCountComments > 0 ? '#FE74F1' : '#444444',
                        marginLeft: '10px',
                      }}
                    >
                      <NewIcons.card_message_pink style={{ width: 23, marginRight: '8px' }} />
                      <span>{state?.announce?.getCountComments}</span>
                    </Action>

                    <Action
                      onClick={() => {
                        if (!isAuthenticated) {
                          router.push({
                            pathname: '/auth/login',
                            query: { redirect: router.asPath },
                          });
                          return;
                        }
                        dispatchModalState({
                          openModalMessaging: true,
                          modalMessagingProfile: state?.announce?.getAuthor,
                          modalMessaginAnnounce: state?.announce,
                        });
                      }}
                      style={{
                        color: state?.announce?.getCountComments > 0 ? '#444444' : '#444444',
                        marginLeft: '10px',
                      }}
                    >
                      <i.MailOutline style={{ position: 'relative', top: -1 }} />
                    </Action>

                    {(state.isAdmin || state.isSelf) && (
                      <div style={{ display: 'flex', gap: 5 }}>
                        <CTALink href={state?.announce?.getAnnounceEditLink} title={t('vehicles:edit-announce')} />
                      </div>
                    )}
                  </div>

                  <div
                    onClick={() => toggleFilters()}
                    style={{ width: '10%', display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}
                  >
                    <i className={clsx('ml-2', 'arrow_nav', hiddenForm ? 'is-left' : 'is-bottom')} />
                  </div>
                </div>

                {!isOwn && (
                  <div className={clsx(hiddenForm && classes.filtersHidden)}>
                    <Comments announceRaw={state?.announce?.getRaw} />
                  </div>
                )}

                {isOwn && (
                  <div
                    className={clsx('price-stars-wrapper', classes.priceStarsWrapper)}
                    style={{ borderBottom: '1px solid #ffffff' }}
                  >
                    <div>
                      {!isLoading && (
                        <div style={{ display: 'flex' }}>
                          <div className={clsx(classes.textfieldcustom)}>
                            <p style={{ fontSize: '12px', color: '#999999', marginBottom: '10px' }}>
                              {t('vehicles:tokenPrice')} :{' '}
                            </p>
                            <TextField
                              onChange={(event) => setTokenPrice(event.target.value)}
                              value={tokenPrice}
                              type="number"
                              InputLabelProps={{ shrink: true }}
                              error={!!error}
                              helperText={error ? error.message : !isConfirmed && t('vehicles:waitingConfirmation')}
                              disabled={!isConfirmed || !active}
                              variant="outlined"
                            />
                          </div>
                          <button
                            className={clsx(classes.buttonblue)}
                            style={{ height: '40px', marginLeft: '10px' }}
                            disabled={!isConfirmed || !tokenPrice || !active}
                            onClick={handleApplyPriceChange}
                          >
                            {isMinted ? t('vehicles:save') : t('vehicles:mint')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Col>
            </>
          )}
        </Row>
        <VehicleEquipments announce={state.announce} />
      </div>
    </Container>
  );
};

export default Announce;
