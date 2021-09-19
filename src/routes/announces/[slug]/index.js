import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { NextSeo } from 'next-seo';
import Link from 'next-translate/Link';
import { useRouter } from 'next/router';
import { Col, Container, Row } from 'reactstrap';
import Alert from '@material-ui/lab/Alert';
import { useWeb3React } from '@web3-react/core';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTranslation from 'next-translate/useTranslation';
import GalleryViewer from '../../../components/Gallery/GalleryViewer';
import DamageViewerTabs from '../../../components/Damages/DamageViewerTabs';
import CarInfos from '../../../components/Products/car/CarInfos';
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
import { Avatar } from '../../../components/AnnounceCard/components';
import { useSocket } from '../../../context/SocketContext';
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

const web3 = new Web3(Web3.givenProvider);

const useStyles = makeStyles(() => ({
  formRow: {
    display: 'flex',

    '& > div': {
      margin: '1rem',
      flex: 1,
    },
  },
  cardTopInfos: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1rem 0',
  },

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

  bordergradientbtn: {
    height: '39px',
    borderRadius: '100rem',
    padding: '1rem',
    fontSize: '14px',
    padding: '8px 30px 2px',
    boxShadow: '0 0 6px 0 rgba(157, 96, 212, 0.5)',
    border: 'solid 2px transparent',
    backgroundImage:
      'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(176deg, #0046f9, #ff08fa);',
    backgroundOrigin: 'border-box',
    backgroundClip: 'content-box, border-box',
    boxShadow: '2px 1000px 1px #fff inset',
    '&:hover': {
      backgroundImage:
        'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #0244ea, #e81ae5)',
    },

    '& label': {
      background:
        '-webkit-linear-gradient(#2C65F6, #ED80EB); -webkit-background-clip: text; -webkit-text-fill-color: transparent',
      backgroundImage: 'linear-gradient(91deg, #084dff, #ff0afb)',
      backgroundClip: 'text',
      color: 'transparent',
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
  const { getOnlineStatusByUserId } = useSocket();
  const { getPriceTracker } = usePriceTracker();
  const [priceBNB, setPrice] = useState(0);
  const [walletPayer, setWalletPayer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenPrice, setTokenPrice] = useState(null);
  const [error, setError] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(true);
  const [isMinted, setIsMinted] = useState(false);
  const tokenPriceInEuros = (+tokenPrice * priceBNB).toFixed(2);

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

  const handleMakeOffer = useCallback(async () => {
    if (!isContractReady || !state?.announce || !tokenPrice || !authenticatedUser.getWallet) return;
    setIsConfirmed(false);
    setError(null);
    const announceId = state?.announce?.getID;
    try {
      setIsConfirmed(false);
      setError(null);

      const task = makeOffer(state?.announce?.getTokenId, tokenPrice);
      const hashTx = await task;

      await TransactionsService.addTransaction({
        announceId,
        hashTx,
        data: authenticatedUser.getWallet,
        action: 'OfferCreated',
      });

      await waitTransactionToBeConfirmed(hashTx);

      setIsConfirmed(true);
      dispatchModal({ msg: t('vehicles:tokenPriceConfirmed') });
    } catch (error) {
      console.error(error);
      setError(error);
      setIsConfirmed(true);
    }
  }, [state?.announce?.getTokenId, isContractReady, bnbBalanceWei, tokenPrice, makeOffer]);

  const handleAcceptOffer = useCallback(
    async (offerHashTx) => {
      try {
        if (!isContractReady || !state?.announce || !tokenPrice || !authenticatedUser.getWallet) return;

        const announceId = state?.announce?.getID;
        setIsConfirmed(false);
        setError(null);

        const task = acceptOffer(state?.announce?.getTokenId);
        const hashTx = await task;

        await TransactionsService.addTransaction({ announceId, hashTx, data: offerHashTx, action: 'OfferAccepted' });

        await waitTransactionToBeConfirmed(hashTx);

        AnnounceService.updateAnnounce(state?.announce.getSlug, { user: newOfferCreated?.user }).then(() =>
          window.location.reload()
        );

        setIsConfirmed(true);
        dispatchModal({ msg: t('vehicles:offerAcceptedConfirmed') });
      } catch (error) {
        console.error(error);
        setError(error);
        setIsConfirmed(true);
      }
    },
    [
      isContractReady,
      state?.announce,
      tokenPrice,
      authenticatedUser.getWallet,
      acceptOffer,
      waitTransactionToBeConfirmed,
      newOfferCreated?.user,
      dispatchModal,
      t,
    ]
  );

  const handleRejectOffer = async (offerHashTx) => {
    try {
      if (!isContractReady || !state?.announce || !tokenPrice || !authenticatedUser.getWallet) return;

      const announceId = state?.announce?.getID;

      const tokenId = state?.announce.getTokenId;
      setIsConfirmed(false);
      setError(null);

      const task = rejectOffer(tokenId);
      const hashTx = await task;

      await TransactionsService.addTransaction({ announceId, hashTx, data: offerHashTx, action: 'OfferRejected' });

      await waitTransactionToBeConfirmed(hashTx);

      setIsConfirmed(true);
      dispatchModal({ msg: t('vehicles:rejectedOffer') });
    } catch (error) {
      console.error(error);
      setError(error);
      setIsConfirmed(true);
    }
  };

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

  const [isLiking, setIsLiking] = useState(false);

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

  const checkIfAlreadyLike = () => {
    const matchUserFavorite = authenticatedUser.getFavorites.find(
      (favorite) => favorite.getID === state?.announce?.getID
    );
    const matchAnnounceLike = state?.announce?.getLikes.find(
      (like) => like.getAuthor.getID === authenticatedUser.getID
    );
    return !!matchUserFavorite || !!matchAnnounceLike;
  };

  const alreadyLikeCurrentUser = checkIfAlreadyLike();

  const [like, setLike] = useState(alreadyLikeCurrentUser);

  const [likesCounter, setLikesCounter] = useState(state?.announce?.getCountLikes);

  useEffect(() => {
    setLike(alreadyLikeCurrentUser);
    setLikesCounter(state?.announce?.getCountLikes);
  }, [state?.announce]);

  const isOwn = authenticatedUser?.raw?._id === state?.announce?.raw?.user?._id;

  const toggleVisibility = () => {
    AnnounceService.updateAnnounce(state?.announce?.getSlug, { visible: !state?.announce?.raw?.visible }).then(() =>
      window.location.reload()
    );
  };

  const handleClickLikeButton = async () => {
    if (isOwn) return;
    if (!isAuthenticated) {
      router.push({
        pathname: '/auth/login',
        query: { redirect: router.asPath },
      });
      return;
    }
    if (isLiking) return;
    setIsLiking(true);
    try {
      if (like) {
        setLike(false);
        setLikesCounter((likesCounter) => likesCounter - 1);
        await AnnounceService.removeLikeLoggedInUser(state?.announce?.getID);
      } else {
        setLike(true);
        setLikesCounter((likesCounter) => likesCounter + 1);
        await AnnounceService.addLikeLoggedInUser(state?.announce?.getID);
      }
      setIsLiking(false);
    } catch (err) {
      dispatchModalError({ err });
    }
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
            <>
              <Col sm={12} md={6}>
                <div
                  className="top"
                  style={{ marginTop: '25px', marginBottom: '15px', marginLeft: '15px', display: 'flex' }}
                >
                  <Row>
                    <div className="pic" style={{ width: '32%' }}>
                      <Avatar
                        className="img-profile-wrapper avatar-preview"
                        src={state?.announce?.getAuthor.getAvatar || state?.announce?.getAuthor.getAvatarUrl}
                        isonline={getOnlineStatusByUserId(state?.announce?.getAuthor.getID)}
                        alt={state?.announce?.getTitle}
                        style={{ width: 120, height: 120 }}
                      />
                    </div>

                    <div style={{ marginLeft: '10px', width: '65%' }}>
                      <Link href={`/profile/${state?.announce?.getAuthor.getUsername}`}>
                        <a>
                          <Typography
                            style={{
                              paddingLeft: 4,
                              fontWeight: '600',
                              fontSize: '16px !important',
                              lineHeight: '150%',
                            }}
                          >
                            {state?.announce?.getAuthor.getFullName}
                          </Typography>
                        </a>
                      </Link>

                      {state?.announce?.getAdOrAuthorCustomAddress(['city', 'postCode', 'country']) && (
                        <div className="top-profile-location">
                          <a href={state?.announce?.buildAddressGoogleMapLink()} target="_blank" rel="noreferrer">
                            <span
                              className="top-profile-location"
                              style={{ fontWeight: 'normal', fontSize: '16px', lineHeight: '150%', color: '#999999' }}
                            >
                              <NewIcons.card_location style={{ marginRight: '5px' }} />
                              {state?.announce?.getAdOrAuthorCustomAddress()}
                            </span>
                          </a>
                        </div>
                      )}
                    </div>
                  </Row>
                </div>

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
                    <div style={{ marginRight: '15px' }}>
                      <button
                        className={clsx(classes.bordergradientbtn)}
                        disabled={!isContractReady || !isConfirmed || tokenPrice === null}
                        onClick={handleAcceptOffer}
                      >
                        <label>{t('vehicles:acceptOffer')}</label>
                      </button>
                    </div>
                    <div>
                      <button
                        className={clsx(classes.bordergradientbtn)}
                        disabled={!isContractReady || !isConfirmed || tokenPrice === null}
                        onClick={handleRejectOffer}
                      >
                        <label>{t('vehicles:rejectOffer')}</label>
                      </button>
                    </div>
                  </Row>
                )}

                {!isOwn && isMinted && !newOfferCreated && authenticatedUser.getWallet && (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      className={clsx(classes.buttonblue)}
                      disabled={!isContractReady || !isConfirmed || tokenPrice === null || +bnbBalance < +tokenPrice}
                      onClick={handleMakeOffer}
                    >
                      {' '}
                      {t('vehicles:makeOffer')}{' '}
                    </button>
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
                    <Action title={t('vehicles:i-like')} onClick={() => handleClickLikeButton()}>
                      <i.BookmarkBorder
                        style={{
                          color: like ? '#444444' : '#444444',
                          marginRight: '8px',
                        }}
                      />
                      <span style={{ color: '#444444' }}>{likesCounter}</span>
                    </Action>

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
            </>
          ) : (
            <>
              <Col sm={12} md={6}>
                <div className="top" style={{ marginTop: '10px', marginBottom: '30px', marginLeft: '15px' }}>
                  <Row>
                    <div className="pic">
                      <Avatar
                        className="img-profile-wrapper avatar-preview"
                        src={state?.announce?.getAuthor.getAvatar || state?.announce?.getAuthor.getAvatarUrl}
                        isonline={getOnlineStatusByUserId(state?.announce?.getAuthor.getID)}
                        alt={state?.announce?.getTitle}
                        style={{ width: 120, height: 120 }}
                      />
                    </div>

                    <div style={{ marginLeft: '10px' }}>
                      <Link href={`/profile/${state?.announce?.getAuthor.getUsername}`}>
                        <a>
                          <Typography
                            style={{
                              paddingLeft: 4,
                              fontWeight: '600',
                              fontSize: '16px !important',
                              lineHeight: '150%',
                            }}
                          >
                            {state?.announce?.getAuthor.getFullName}
                          </Typography>
                        </a>
                      </Link>

                      {state?.announce?.getAdOrAuthorCustomAddress(['city', 'postCode', 'country']) && (
                        <div className="top-profile-location">
                          <a href={state?.announce?.buildAddressGoogleMapLink()} target="_blank" rel="noreferrer">
                            <span
                              className="top-profile-location"
                              style={{ fontWeight: 'normal', fontSize: '16px', lineHeight: '150%', color: '#999999' }}
                            >
                              <NewIcons.card_location style={{ marginRight: '5px' }} />
                              {state?.announce?.getAdOrAuthorCustomAddress()}
                            </span>
                          </a>
                        </div>
                      )}
                    </div>
                  </Row>
                </div>

                <div className="pics">
                  {state?.announce?.getCountImages > 0 && (
                    <GalleryViewer images={state?.announce?.getImages} ref={refImg} />
                  )}
                </div>
              </Col>

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

                <TagsList tags={state?.announce?.getTags} />

                <div className={clsx('price-stars-wrapper', classes.priceStarsWrapper)} style={{ marginTop: '-15px' }}>
                  <div className="icons-profile-wrapper" style={{ width: '90%' }}>
                    {isOwn && (
                      <Action onClick={toggleVisibility}>
                        {state?.announce?.getIsVisible ? <i.VisibilityOutlined /> : <i.VisibilityOffOutlined />}
                      </Action>
                    )}
                    <Action title={t('vehicles:i-like')} onClick={() => handleClickLikeButton()}>
                      <i.BookmarkBorder
                        style={{
                          color: like ? '#444444' : '#444444',
                          marginRight: '8px',
                        }}
                      />
                      <span style={{ color: '#444444' }}>{likesCounter}</span>
                    </Action>

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

                {!isOwn && isMinted && !newOfferCreated && authenticatedUser.getWallet && (
                  <>
                    <button
                      className={clsx(classes.buttonblue)}
                      disabled={!isContractReady || !isConfirmed || tokenPrice === null || +bnbBalance < +tokenPrice}
                      onClick={handleMakeOffer}
                    >
                      {' '}
                      {t('vehicles:makeOffer')}{' '}
                    </button>
                  </>
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
        <div style={{ marginTop: '50px' }}>
          <section className="my-2" style={{ marginTop: '15px' }}>
            <Typography component="h3" variant="h3">
              {t('vehicles:vehicle-data')}
            </Typography>
            <CarInfos announce={state?.announce} enableThirdColumn />
          </section>

          <section className="my-2" style={{ marginTop: '15px' }}>
            <Typography component="h3" variant="h3">
              {t('vehicles:equipments')}
            </Typography>
            <Row>
              {state?.announce?.getVehicleEquipments.map((equipment, index) => {
                return (
                  <Col sm={6} md={3} key={index}>
                    <div className="equipment m-3">
                      <Typography>{equipment.label}</Typography>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </section>

          <section className="my-2" style={{ marginTop: '15px' }}>
            <Typography component="h3" variant="h3">
              {t('vehicles:description')}
            </Typography>
            <div className={classes.wysiwyg}>
              <Typography>{state?.announce?.getDescription}</Typography>
            </div>
          </section>

          <section className="my-2" style={{ marginTop: '15px' }}>
            <Typography component="h3" variant="h3">
              {t('vehicles:data-sheet')}
            </Typography>
            {isMobile ? (
              <div style={{ marginTop: 40 }}>
                <DamageViewerTabs
                  tabs={state?.announce?.getDamagesTabs}
                  vehicleType={state?.announce?.getVehicleType}
                />
              </div>
            ) : (
              <DamageViewerTabs tabs={state?.announce?.getDamagesTabs} vehicleType={state?.announce?.getVehicleType} />
            )}
          </section>
        </div>
      </div>
    </Container>
  );
};

export default Announce;
