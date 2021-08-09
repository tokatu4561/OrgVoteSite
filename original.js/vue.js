let currentUID;
$('#login__help').hide();

// ログインにて表示・非表示
const changeView = () => {
    if (currentUID != null) {
        $('.visible-on-login')
            .removeClass('hidden-block')
            .addClass('visible-block');
        $('.visible-on-logout')
            .removeClass('visible-block')
            .addClass('hidden-block');
    }
    else {
        $('.visible-on-login')
            .removeClass('visible-block')
            .addClass('hidden-block');
        $('.visible-on-logout')
            .removeClass('hidden-block')
            .addClass('visible-block');
    }
};
// ログインに失敗
const catchErrorOnSignIn = (error) => {
    // ログインフォームを初期状態に戻す
    $('#login__help').hide();
    $('#login__submit-button')
        .prop('disabled', false)
        .text('ログイン');
    if (error.code === 'auth/wrong-password') {
        // パスワードの間違い
        $('#login__help')
            .text('正しいパスワードを入力してください')
            .fadeIn();
    }
};

// ログイン状態の変化を監視する
firebase.auth().onAuthStateChanged((user) => {
    // ログイン状態が変化した
    if (user) {
        // ログイン済
        currentUID = user.uid;
        changeView();
    }
    else {
        // 未ログイン
        changeView();
    }
});

// ログイン処理
$('#login-form').on('submit', (e) => {
    e.preventDefault();

    $('#login__submit-button')
        .prop('disabled', true)
        .text('送信中…');

    const email = $('#login-email').val();
    const password = $('#login-password').val();
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            console.log('ログインしました。');
        })
        .catch((error) => {
            console.error('ログインエラー', error);
            if (error.code === 'auth/user-not-found') {
                // 該当ユーザが存在しない場合は新規作成する
                firebase
                    .auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then(() => {
                        // 作成成功
                        console.log('ユーザを作成しました');
                    });
            }
            else {
                catchErrorOnSignIn(error);
            }
        });
});

// ログアウト処理
// ログイン状態の変化を監視する
$('.logout-button').on('click', (e) => {
    e.preventDefault;
    firebase
        .auth()
        .signOut()
        .catch((error) => {
            console.error('ログアウトに失敗:', error);
        });
});

// グラフを描画する
Vue.component('pie-chart', {
    props: ['option'],
    extends: VueChartJs.Pie,
    data: () => ({
        chartdata: {
            datacollection: {
                height: 100,
                labels: [],
                datasets: [{
                    label: 'My First Dataset',
                    data: [],
                    backgroundColor: [
                        'rgb(0, 91, 246)',
                        'rgb(75, 168, 255)',
                        'rgb(151, 205, 255)',
                        'rgb(0, 246, 240)',
                    ],
                    hoverOffset: 4
                }]
            }
        },
        options: {
            // ラベルを削除する
            legend: {
                    display: false},
            stacked: "100%",
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                }
            },
        },
    }),
    computed: {
        // myStyles() {
        //     return {
        //         height: `${this.chartdata.datacollection.height}px`,
        //         position: 'relative'
        //     };
        // }
    },
    methods: {
        chartdataUpdate: function() {
            this.chartdata.datacollection.datasets[0].data = [this.option.option2.counts, this.option.option1.counts];
            if (Object.keys(this.option).length - 3 == 2) {}
            else if (Object.keys(this.option).length - 3 == 3) {
                this.chartdata.datacollection.datasets[0].data = [this.option.option2.counts, this.option.option1.counts, this.option.option3.counts];
            }
            else if (Object.keys(this.option).length - 3 == 4) {
                this.chartdata.datacollection.datasets[0].data = [this.option.option2.counts, this.option.option1.counts, this.option.option3.counts, this.option.option4.counts];
            }
        },
    },
    watch: {
        'option.option1.counts': function() {
            this.chartdataUpdate();
            this.renderChart(this.chartdata.datacollection, this.options);
        },
        'option.option2.counts': function() {
            this.chartdataUpdate();
            this.renderChart(this.chartdata.datacollection, this.options);
        },
        'option.option3.counts': function() {
            this.chartdataUpdate();
            this.renderChart(this.chartdata.datacollection, this.options);
        },
        'option.option4.counts': function() {
            this.chartdataUpdate();
            this.renderChart(this.chartdata.datacollection, this.options);
        },
    },
    mounted() {
        this.chartdataUpdate();
        if (Object.keys(this.option).length - 3 == 2) {
            this.chartdata.datacollection.labels = [this.option.option2.optionText, this.option.option1.optionText];
        }
        else if (Object.keys(this.option).length - 3 == 3) {
            this.chartdata.datacollection.labels = [this.option.option2.optionText, this.option.option1.optionText, this.option.option3.optionText];
        }
        else if (Object.keys(this.option).length - 3 == 4) {
            this.chartdata.datacollection.labels = [this.option.option2.optionText, this.option.option1.optionText, this.option.option3.optionText, this.option.option4.optionText];
        }
        this.renderChart(this.chartdata.datacollection, this.options);
    },
});

new Vue({
    el: '#original',
    data: {
        activePage: 'homePage',
        postImage: 'ファイルを選択肢してください',
        postImageSec: 'ファイルを選択してください',
        options: {},
        choices: {
            option1: {
                text: '',
                optionImageLocation: ''
            },
            option2: {
                text: '',
                optionImageLocation: '',
            }
        },
        count: 3,
    },
    methods: {
        // 投稿画面で選択肢を追加する
        moreOption() {
            if (Object.keys(this.choices).length < 4) {
                let optionsCount = Object.keys(this.choices).length + 1;
                Vue.set(this.choices, `option${optionsCount}`, {
                    text: '',
                    optionImageLocation: ''
                });
                console.log(optionsCount);
            }
            else {
                window.alert('投稿出来る選択肢は４つまでです');
            }
        },
        // 投稿画面で選択肢を減らす
        subOption() {
            if (Object.keys(this.choices).length > 2) {
                let optionsCount = Object.keys(this.choices).length;
                Vue.delete(this.choices, `option${optionsCount}`);
                console.log(optionsCount);
            }
            else {
                window.alert('選択肢は二つ以上必要です');
            }
        },
        // firebaes上で選択肢が投票されたらカウントを増やす
        optionVote: function(id) {
            const VoteRef = firebase.database().ref(`options/${id}/option1/vote/${currentUID}`);
            VoteRef.set(true);
        },
        // firebaes上で選択肢が投票されたらカウントを増やす
        optionVoteSec: function(id) {
            const VoteRef = firebase.database().ref(`options/${id}/option2/vote/${currentUID}`);
            VoteRef.set(true);
        },
        // firebaes上で選択肢が投票されたらカウントを増やす
        optionVoteThird: function(id) {
            const VoteRef = firebase.database().ref(`options/${id}/option3/vote/${currentUID}`);
            VoteRef.set(true);
        },
        // firebaes上で選択肢が投票されたらカウントを増やす
        optionVoteForth: function(id) {
            const VoteRef = firebase.database().ref(`options/${id}/option4/vote/${currentUID}`);
            VoteRef.set(true);
        },
        // 投稿したユーザーのUIDであればdeleteUIDデータを切り替え
        deleteOption: function(option) {
            if (option.currentUID === currentUID) {
                return true;
            }
            else {
                return false;
            }
        },
        // 画像データを取得
        imageUploaded: function(option, e) {
            const image = e.target.files[0];
            this.choices[option].optionImageLocation = image;
        },
        //firebaseに選択した画像とテキストをアップロードする
        async uploadDatastructure(event) {
            event.target.elements.submitButton.textContent = '送信中...';
            const optionTheme = event.target.elements.theme.value;
            // const optionText = event.target.elements.text.value;
            // const optionTextSec = event.target.elements.textsec.value;
            // const firstFiles = event.target.elements.file.files;
            // const secondFiles = event.target.elements.filesec.files;

            // if (firstFiles.length === 0 && secondFiles.length === 0) {
            //     return;
            // }
            // const file = firstFiles[0];
            // const filename = file.name;
            // const secondFile = secondFiles[0];
            // const secondFilename = secondFile.name;
            // const optionImageLocation = `post-images/${filename}`;
            // const optionImageLocationSec = `post-images/${secondFilename}`;
            const optionData = {
                optionTheme,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                currentUID,
            };

            for (const key in this.choices) {
                console.log(key);
                let optionImageLocation = `post-images/${this.choices[key].optionImageLocation.name}`;
                console.log(optionImageLocation);
                let optionText = this.choices[key].text;
                await firebase.storage().ref(optionImageLocation).put(this.choices[key].optionImageLocation);
                await firebase.storage().ref(optionImageLocation).getDownloadURL().then((url) => {
                    optionData[key] = {
                        optionImageLocation: url,
                        optionText
                    };
                });
            }
            await firebase.database().ref('options').push(optionData);
            this.activePage = "ListPage";
            // firebase  
            //     .storage()
            //     .ref(optionImageLocation)
            //     .put(file)
            //     .then(() => {
            //         firebase
            //             .storage()
            //             .ref(optionImageLocationSec)
            //             .put(secondFile)
            //             .then(() => {
            //                 const optionData = {
            //                     option1: {
            //                         optionText,
            //                         optionImageLocation,
            //                     },
            //                     option2: {
            //                         optionText: optionTextSec,
            //                         optionImageLocation: optionImageLocationSec,
            //                     },
            //                     optionTheme,
            //                     createdAt: firebase.database.ServerValue.TIMESTAMP,
            //                     currentUID,
            //                 };
            //                 console.log(optionData);
            //                 const promise1 = firebase.storage().ref(optionImageLocation).getDownloadURL();
            //                 const promise2 = firebase.storage().ref(optionImageLocationSec).getDownloadURL();
            //                 Promise.all([promise1, promise2]).then((values) => {
            //                     optionData.option1.optionImageLocation = values[0];
            //                     optionData.option2.optionImageLocation = values[1];
            //                     return firebase
            //                         .database()
            //                         .ref('options')
            //                         .push(optionData);
            //                 });
            //             });
            //     });
        },
        //firebaseに選択した画像とテキストを削除する
        removeDatastracture(id) {
            return firebase
                .database()
                .ref(`options/${id}`)
                .remove();
        },
        // 投稿する画像のファイル名を表示する
        displayImageFile(event) {
            const input = event.target;
            // const $label = $('#add-post-image-label');
            const file = input.files[0];
            if (file != null) {
                // $label.text(file.name);
                this.postImage = file.name;
            }
            else {
                // $label.text('ファイルを選択してください');
                this.postImage = 'ファイルを選択してください';
            }
        },
        displayImageFileSec(event) {
            const input = event.target;
            const file = input.files[0];
            if (file != null) {
                this.postImageSec = file.name;
            }
            else {
                this.postImageSec = 'ファイルを選択してください';
            }
        },
    },
    created() {
        // firebase上にデータが投稿されたらvue上にデータを登録する
        const optionsRef = firebase
            .database()
            .ref('options')
            .orderByChild('createdAt');
        // 投稿をVueのデータへ追加
        optionsRef.on('child_added', (snapshot) => {
            const optionData = snapshot.val();
            // this.options[snapshot.key] = optionData;
            Vue.set(this.options, snapshot.key, optionData);
            console.log(this.options[snapshot.key]);
            // 投票カウントを初期化
            // this.options[snapshot.key].option1.counts = 0;
            Vue.set(this.options[snapshot.key].option1, 'counts', 0);
            // this.options[snapshot.key].option2.counts = 0;
            Vue.set(this.options[snapshot.key].option2, 'counts', 0);

            if (this.options[snapshot.key].option4 != undefined) {
                Vue.set(this.options[snapshot.key].option4, 'counts', 0);
            }
            if (this.options[snapshot.key].option3 != undefined) {
                Vue.set(this.options[snapshot.key].option3, 'counts', 0);
            }
            // option1が投票されたらカウント
            console.log(this.options);
            firebase
                .database()
                .ref(`options/${snapshot.key}/option1/vote`)
                .on('child_added', (snap) => {
                    let count = this.options[snapshot.key].option1.counts;
                    count += 1;
                    this.options[snapshot.key].option1.counts = count;
                    // console.log(this.options[snapshot.key].option1.vote);
                    // const voteProperties = Object.keys(this.options[snapshot.key].option1.vote);
                    // for (let i = 0; i < voteProperties.length; i++) {
                    // }
                });
            // option2が投票されたらカウント
            firebase
                .database()
                .ref(`options/${snapshot.key}/option2/vote`)
                .on('child_added', (snap) => {
                    let count = this.options[snapshot.key].option2.counts;
                    count += 1;
                    this.options[snapshot.key].option2.counts = count;
                });
            //option3が投票されたらカウント
            firebase
                .database()
                .ref(`options/${snapshot.key}/option3/vote`)
                .on('child_added', (snap) => {
                    let count = this.options[snapshot.key].option3.counts;
                    count += 1;
                    this.options[snapshot.key].option3.counts = count;
                });
            //option4が投票されたらカウント
            firebase
                .database()
                .ref(`options/${snapshot.key}/option4/vote`)
                .on('child_added', (snap) => {
                    let count = this.options[snapshot.key].option4.counts;
                    count += 1;
                    this.options[snapshot.key].option4.counts = count;
                    // this.$forceUpdate();
                });
        });
        optionsRef.on('child_removed', (snapshot) => {
            delete this.options[snapshot.key];
            this.$forceUpdate();
        });
    },
    mounted() {},
});
