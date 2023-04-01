import React, { useEffect, useState } from "react";
import { ThreeCircles } from "react-loader-spinner";
import { Button, Modal } from "antd";

import abiDecoder from "abi-decoder";

import { useLocation } from "react-router-dom";
import Web3 from "web3";
import { ICU, BEP20, USDT, EXAM } from "../../utils/web3.js";

// import { baseUrl, ClientBaseURL } from "../../utils/confix";

const Dashboard = () => {
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();
  const [frznBalance, setFrznBalance] = useState();
  const [registration_Free, setRegistrationFee] = useState();
  const [tokenBalance, setTokenBalance] = useState();
  const [current_id, setCurrentId] = useState();
  const [current_tokenAccepting, setCurrentTokenAccepting] = useState();
  const [tokenRewarded, setTokenRewarded] = useState();
  const [payAutoPool, setPayAutoPool] = useState();
  const [levelPrice, setLevelPrice] = useState();

  // const [referrerID, setReferrerID] = useState({ id: "", coref: "" });
  const [referrerID, setReferrerID] = useState({ id: "" });
  const [tokenReword, setTokenReword] = useState({ amount: "" });
  const [regFess, setRegFess] = useState({ amount: "" });
  const [tkAcc, settkAcc] = useState(null);

  // set it latter
  const [tokenPrice, setTokenPrice] = useState();
  const [nextReward, setNetxtReward] = useState();
  const [copySuccess, setCopySuccess] = useState(false);

  const [userAc, setUserAc] = useState(0);
  const [loader, setLoader] = useState(false);

  //////////////////////////////////
  const location = useLocation().search;

  const abcref = new URLSearchParams(location).get("abcref");
  const refid = new URLSearchParams(location).get("refid");

  useEffect(() => {
    if (abcref === "123xyz") {
      if (refid !== 0) {
        setReferrerID({ ...referrerID, id: refid });
      }
    }
  }, []);
  //////////////////////////////////
  const [udAutoPoolPayReceived, setUdAutoPoolPayReceived] = useState();
  const [udAutopoolPayReciever, setUdAutopoolPayReciever] = useState();
  const [udCoreferredUsers, setUdCoreferredUsers] = useState();
  const [udCoreferrerID, setUdCoreferrerID] = useState();
  const [udId, setUdId] = useState();
  const [udIncome, setUdIncome] = useState();
  const [udIsExist, setUdIsExist] = useState();
  const [udLevelIncomeReceived, setUdLevelIncomeReceived] = useState();
  const [udMissedPoolPayment, setUdMmissedPoolPayment] = useState();
  const [udReferredUsers, setUdReferredUsers] = useState();
  const [udReferrerID, setUdReferrerID] = useState();
  const [udStageIncomeReceived, setUdStageIncomeReceived] = useState();
  const [exSubAdmin, setExSubAdmin] = useState();

  // user Details
  useEffect(() => {
    async function user_detail() {
      const account = await web3.eth.requestAccounts();

      let EXAM_CONTREC = new web3.eth.Contract(EXAM.ABI, EXAM.address);
      let subAdmin = await EXAM_CONTREC.methods.isQualified(account[0]).call();
      setExSubAdmin(subAdmin);

      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
      let userDetail = await ICU_.methods.users(account[0]).call();
      let {
        autoPoolPayReceived,
        autopoolPayReciever,
        coreferredUsers,
        coreferrerID,
        id,
        income,
        isExist,
        levelIncomeReceived,
        missedPoolPayment,
        referredUsers,
        referrerID,
        stageIncomeReceived,
      } = userDetail;
      setUdAutoPoolPayReceived(autoPoolPayReceived);
      setUdCoreferredUsers(coreferredUsers);
      setUdCoreferrerID(coreferrerID);
      setUdId(id);
      setUdIncome(income);
      setUdIsExist(isExist);
      setUdLevelIncomeReceived(levelIncomeReceived);
      setUdMmissedPoolPayment(missedPoolPayment);
      setUdReferredUsers(referredUsers);
      setUdReferrerID(referrerID);
      setUdStageIncomeReceived(stageIncomeReceived);
      let payReciverUserD = await ICU_.methods
        .users(autopoolPayReciever)
        .call();
      setUdAutopoolPayReciever(payReciverUserD.id);
    }
    user_detail();
  }, []);

  //////////////////////////////////

  function roundToFour(num) {
    return +(Math.round(num + "e+4") + "e-4");
  }

  useEffect(() => {
    async function load() {
      const accounts = await web3.eth.requestAccounts();
      if (!accounts) {
        alert("please install metamask");
      }
      let balance = await web3.eth.getBalance(accounts[0]);
      const etherValue = web3.utils.fromWei(balance, "ether");

      setBalance(roundToFour(etherValue));
      setAccount(accounts[0]);
      let BEP20_ = new web3.eth.Contract(BEP20.ABI, BEP20.address);
      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
      let frozenBalance = await BEP20_.methods
        ._frozenBalance(accounts[0])
        .call();
      let RegistrationFee = await ICU_.methods.getRegistrationFess().call();
      let currentId = await ICU_.methods.currUserID().call();
      let currentTokenAccepting = await ICU_.methods
        .currentTokenAccepting()
        .call();
      let token_rewared = await ICU_.methods.tokenReward().call();
      let pay_auto_pool = await ICU_.methods.Autopool_Level_Income().call();
      let level_income = await ICU_.methods.level_income().call();
      let tokenPriceIs = await ICU_.methods.tokenPrice().call();
      let getNextReward = await ICU_.methods.getNextReward().call();
      // console.log("level income", level_income, getNextReward, tokenPriceIs);

      // const etherValue = Web3.utils.fromWei('1000000000000000000', 'ether');

      const convert_pay_auto_pool = web3.utils.fromWei(pay_auto_pool, "ether");

      const frozenBalance_convert = web3.utils.fromWei(frozenBalance, "ether");
      setFrznBalance(roundToFour(frozenBalance_convert));

      const convert_regfee = web3.utils.fromWei(RegistrationFee, "ether");
      setRegistrationFee(convert_regfee);

      setCurrentId(currentId);
      setCurrentTokenAccepting(currentTokenAccepting);

      const token_rewared_convert = web3.utils.fromWei(token_rewared, "ether");
      setTokenRewarded(roundToFour(token_rewared_convert));
      setPayAutoPool(roundToFour(convert_pay_auto_pool));

      const convert_levelincome = web3.utils.fromWei(level_income, "ether");
      setLevelPrice(roundToFour(convert_levelincome));

      // token balance
      let token_balance = await BEP20_.methods.balanceOf(accounts[0]).call();

      const convert_tokenBal = web3.utils.fromWei(token_balance, "ether");
      setTokenBalance(roundToFour(convert_tokenBal));

      // Set Token PRice and Next Level Reward
      const tokenPriceIs_convert = web3.utils.fromWei(tokenPriceIs, "ether");
      const getNextReward_convert = web3.utils.fromWei(getNextReward, "ether");

      setTokenPrice(tokenPriceIs_convert);
      setNetxtReward(roundToFour(getNextReward_convert));
    }

    function roundToFour(num) {
      return +(Math.round(num + "e+4") + "e-4");
    }
    load();
  }, []);

  const handleChange = (event) => {
    let { name, value } = event.target;
    setReferrerID({ ...referrerID, [name]: value });
  };

  const handleChangeTkReword = (event) => {
    let { name, value } = event.target;
    setTokenReword({ ...tokenReword, [name]: value });
  };

  const handleChangeRegFess = (event) => {
    let { name, value } = event.target;
    setRegFess({ ...regFess, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let { id } = referrerID;
    // console.log("before sircle");
    let coRefId;

    // console.log("after sircle");

    // return;
    setLoader(true);
    setIsModalOpen(true);
    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    let value_ = await ICU_.methods.REGESTRATION_FESS().call();
    let EXAM_CONTREC = new web3.eth.Contract(EXAM.ABI, EXAM.address);

    // console.log("resonse value", value_);

    let currentTokenAccepting = await ICU_.methods
      .currentTokenAccepting()
      .call();
    //.on("error", console.error);
    // console.log("the user id", id);
    let ref_user_acc = await ICU_.methods.userList(id).call();
    let ref_user_detail = await ICU_.methods.users(ref_user_acc).call();
    // console.log("ref_user_detail", ref_user_detail);
    const { referredUsers, coreferrerID } = ref_user_detail;

    let subAdmin = await EXAM_CONTREC.methods.isQualified(ref_user_acc).call();
    // console.log("sub admin", subAdmin);
    if (subAdmin && parseInt(referredUsers) > 2) {
      coRefId = id;
    } else {
      coRefId = coreferrerID;
    }
    // console.log("the approve currentTokenAccepting", currentTokenAccepting);
    // the approve currentTokenAccepting ERC20-Token-Accepting

    if (currentTokenAccepting === "Native-Coin-Accepting") {
      let USDT_ = new web3.eth.Contract(USDT.ABI, USDT.address);
      let isAllowance = await USDT_.methods
        .allowance(account, ICU.address)
        .call();
      let isApprove, reg_user;
      console.log("iss alloweance");
      if (isAllowance < value_) {
        isApprove = await USDT_.methods
          .approve(ICU.address, value_)
          .send({ from: account })
          .on("error", console.error);
        console.log("is approved after asss allownce");
      } else {
      }
      console.log("isApprove", isApprove);
      reg_user = await ICU_.methods
        .Registration(id, coRefId, value_)
        .send({ from: account, value: 0 })
        .on("error", (err) => {
          console.log("the error in reg", err);
          setLoader(false);
          setIsModalOpen(false);
        });
      console.log("reg_user", reg_user);

      console.log("****** native coin accepting condtion", reg_user);
      if (reg_user.status) {
        setLoader(false);
        setIsModalOpen(false);
        alert("Registerd Success");
      } else {
        alert("Registerd Failed !!!!");
        setLoader(false);
        setIsModalOpen(false);
      }
    } else {
      let BEP20_ = new web3.eth.Contract(BEP20.ABI, BEP20.address);
      let approve = await BEP20_.methods
        .approve(ICU.address, value_)
        .send({ from: account });
      // .on("error", console.error);
      console.log("the approve response", approve);
      console.log("the value out of status", value_);
      if (approve.status === true) {
        let reg_user = await ICU_.methods
          .regUser(id, coRefId, value_)
          .send({ from: account, value: 0 })
          .on("error", (err) => {
            console.log("the error in reg", err);
            setLoader(false);
            setIsModalOpen(false);
          });
        if (reg_user.status) {
          alert("Registerd Success");
          setLoader(false);
          setIsModalOpen(false);
        } else {
          alert("Registerd Failed !!!!");
          setLoader(false);
          setIsModalOpen(false);
        }
      }
    }
  };

  const tokenAcceptanceOption = [
    { value: "true", label: "True" },
    { value: "false", label: "False" },
  ];

  // your function to copy here
  const copyToClipBoard = async () => {
    try {
      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
      let { id } = await ICU_.methods.users(userAc).call();
      if (parseInt(id) === 0) {
        alert("Referral Id not found");
        return;
      }
      let ClientBaseURL = "";

      let refLink = `${ClientBaseURL}?refid=${id}&abcref=123xyz`;
      await navigator.clipboard.writeText(refLink);
      setCopySuccess(true);
    } catch (err) {
      setCopySuccess(false);
    }
  };
  async function userAccount() {
    const accounts = await web3.eth.requestAccounts();
    if (!accounts) {
      alert("please install metamask");
    }
    setUserAc(accounts[0]);
  }
  useEffect(() => {
    userAccount();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="home-container container">
      <div className="row public-section-bg">
        {/* ////// */}
        {/* public value  */}
        {/* ////// */}
        <div className="col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body text-center">Public Value</div>
          </div>
        </div>
        {/* reg fee 1 */}
        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Registration Fee</h6>
              <h4 className="mb-0">
                {registration_Free ? registration_Free : 0} (USDT)
              </h4>
            </div>
          </div>
        </div>
        {/* Current ID 2 */}
        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Current ID</h6>
              <h4 className="mb-0">{current_id ? current_id : 0}</h4>
            </div>
          </div>
        </div>
        {/* Direct Income 3  */}
        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Direct Income</h6>
              <h4 className="mb-0">
                {current_tokenAccepting ? registration_Free / 4 : 0} (USDT)
              </h4>
            </div>
          </div>
        </div>
        {/* Token reward  4 */}
        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Token reward</h6>
              <h4 className="mb-0">
                {tokenRewarded ? tokenRewarded : 0} (SLR)
              </h4>
            </div>
          </div>
        </div>
        {/* Next Reward   */}
        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Next Reward</h6>
              <h4 className="mb-0">{nextReward ? nextReward : 0} (SLR)</h4>
            </div>
          </div>
        </div>
        {/* Is Exist  */}
        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Is Exist</h6>
              <h4 className="mb-0">{udIsExist ? "YES" : "NO"}</h4>
            </div>
          </div>
        </div>
        {/* sub admin  */}
        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Sub Admin </h6>
              <h4 className="mb-0">{exSubAdmin ? "YES" : "NO"}</h4>
            </div>
          </div>
        </div>
        {/* autopool income  */}
        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Autopool Income</h6>
              <h2 className="mb-0">{payAutoPool ? payAutoPool : 0} (USDT)</h2>
            </div>
          </div>
        </div>
        {/* level income  */}
        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Level Income</h6>
              <h2 className="mb-0">{levelPrice ? levelPrice : 0} (USDT)</h2>
            </div>
          </div>
        </div>
        {/* stage income */}
        {exSubAdmin ? (
          <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h6>Stage Income</h6>
                <h2 className="mb-0">
                  {levelPrice ? levelPrice * 2 : 0} (USDT)
                </h2>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      {udIsExist ? (
        <div
          className={`row  ${
            exSubAdmin && udReferredUsers < 3
              ? "private-section-bg-light-green"
              : !exSubAdmin && udReferredUsers < 0
              ? "private-section-bg-light-yellow"
              : "private-section-bg-light-red"
          } `}
        >
          {/* ////// */}
          {/* private  */}
          {/* ////// */}
          <div className="col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body text-center">Private Value</div>
            </div>
          </div>
          {/* forezen balace  */}
          <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h6>Frozen Balance </h6>
                <h4 className="mb-0">{frznBalance ? frznBalance : 0} (SLR)</h4>
              </div>
            </div>
          </div>
          {/* Token balace  */}
          <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h6>Token Balance</h6>
                <h4 className="mb-0">
                  {tokenBalance ? tokenBalance : 0} (SLR)
                </h4>
              </div>
            </div>
          </div>
          {/* bnb balance  */}
          <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h6>BNB Balance</h6>
                <h4 className="mb-0">{balance ? balance : 0}</h4>
              </div>
            </div>
          </div>
          {/* Token Price  */}
          {/* <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Token Price</h6>
              <h4 className="mb-0">{tokenPrice ? tokenPrice : 0} (USDT)</h4>
            </div>
          </div>
        </div> */}
          {/* Pay Received  */}
          <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h6>Pay Received</h6>
                <h4 className="mb-0">
                  {udAutoPoolPayReceived ? udAutoPoolPayReceived : 0}
                </h4>
              </div>
            </div>
          </div>
          {/* CoReferre ID  */}
          <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h6>CoReferre ID</h6>
                <h4 className="mb-0">{udCoreferrerID ? udCoreferrerID : 0}</h4>
              </div>
            </div>
          </div>
          {/* User ID  */}
          <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h6>User ID</h6>
                <h4 className="mb-0">{udId ? udId : 0}</h4>
              </div>
            </div>
          </div>
          {/* Income  */}
          <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h6>Income</h6>
                <h4 className="mb-0">{udIncome ? udIncome : 0}</h4>
              </div>
            </div>
          </div>
          {/* Income Received  */}
          <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h6>Income Received</h6>
                <h4 className="mb-0">
                  {udLevelIncomeReceived ? udLevelIncomeReceived : 0}
                </h4>
              </div>
            </div>
          </div>
          {/* Missed Pool  */}
          <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h6>Missed Pool</h6>
                <h4 className="mb-0">
                  {udMissedPoolPayment ? udMissedPoolPayment : 0}
                </h4>
              </div>
            </div>
          </div>
          {/* Referred  */}
          <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h6>Referred</h6>
                <h4 className="mb-0">
                  {udReferredUsers ? udReferredUsers : 0}
                </h4>
              </div>
            </div>
          </div>
          {/* Referrer ID  */}
          <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h6>Referrer ID</h6>
                <h4 className="mb-0">{udReferrerID ? udReferrerID : 0}</h4>
              </div>
            </div>
          </div>
          {exSubAdmin ? (
            <>
              <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <h6>Stage Income</h6>
                    <h4 className="mb-0">
                      {udStageIncomeReceived ? udStageIncomeReceived : 0}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <h6>CoReferre</h6>
                    <h4 className="mb-0">
                      {udCoreferredUsers ? udCoreferredUsers : 0}
                    </h4>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
          {/* pay reciver  */}
          <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h6>Pay Reciever</h6>
                <h4 className="mb-0">
                  {udAutopoolPayReciever ? udAutopoolPayReciever : 0}
                </h4>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {/* Registration section  */}
      {udIsExist ? (
        ""
      ) : (
        <>
          <div className="row private-section-bg">
            <div className="col-sm-12 grid-margin">
              <div className="card">
                <div className="card-body text-center">
                  <h5>Register</h5>
                </div>
              </div>
            </div>
            <div className="col-sm-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-12 my-auto">
                      <form className="forms-sample" onSubmit={handleSubmit}>
                        <div className="form-group w-100">
                          <input
                            className="form-control mt-2"
                            type="number"
                            required
                            name="id"
                            onChange={handleChange}
                            value={referrerID.id}
                            placeholder="Referral ID"
                          />
                          {/* <input
                            className="form-control mt-2"
                            type="number"
                            required
                            name="coref"
                            onChange={handleChange}
                            value={referrerID.coref}
                            placeholder="CoReferral ID"
                          /> */}
                          <input
                            className="btn btn-primary mt-3"
                            type="submit"
                            value="Submit"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 text-center">
              <button className={`ref-btn`} onClick={copyToClipBoard}>
                Click here to copy your Referral link
              </button>
              {copySuccess === true ? (
                <span className="ref-btn-success">✓ copied.</span>
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      )}
      <div className="pt-5"></div>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        className="ant-model-custom"
      >
        <div className="loader-section">
          <ThreeCircles
            height="100"
            width="100"
            color="#4fa94d"
            wrapperStyle={{}}
            wrapperClass=""
            visible={loader}
            ariaLabel="three-circles-rotating"
            outerCircleColor=""
            innerCircleColor=""
            middleCircleColor=""
          />
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
