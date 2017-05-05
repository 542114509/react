var ImgFigure = React.createClass({
    //定义图片子组件
    clickHandler : function(){
        //绑定单击事件
        if(this.props.data.isCenter){
            //接收父组件传值 进行是否居中判断
            this.props.inverse();
            //翻转操作
        }else{
            this.props.center();
            //居中操作
        }
    },
    render : function(){
        var styleObj = {
            left: this.props.data.pos.x,
            top: this.props.data.pos.y,
            transform : "rotate(" + this.props.data.rotate + "deg)"
            //水平翻转
        };
        //定义属性对象 对象中含有事件需要的动画
        if(this.props.data.isInverse){
            styleObj.transform = "rotateY(180deg)";
            //前后翻转
        }
        return (
            //组件结构
            <figure className="img-figure" style={styleObj} onClick={this.clickHandler}>
            //自定义属性
                <img src={"img/" + this.props.info.fileName}>//图片标签末尾加/
                <figcaption>
                    <h2>{this.props.info.title}</h2>
                    <div>{this.props.info.desc}</div>
                </figcaption>
            </figure>
        );
    }
});
var Controller = React.createClass({
//定义小图标组件
    clickHandler : function(){
        //单击事件
        if(this.props.data.isCenter){
            this.props.inverse();
            //居中执行翻转
        }else{
            this.props.center();
            //不居中执行居中
        }
    },
    render : function(){
        var ctrlClassName = "controller"
        if(this.props.data.isCenter){
            ctrlClassName += " is-center";
            if(this.props.data.isInverse){
                ctrlClassName += " is-inverse";
            }
        }
        return (
            <span className={ctrlClassName} onClick={this.clickHandler}><span>//span加/
        );
    }
});

var Photowall = React.createClass({
    //定义照片墙组件
    getInitialState : function(){
        //默认状态
        return {
            imgInfoArr : [{
                pos : {
                    x : 0,
                    y : 0
                },
                rotate : 0,
                isCenter : false,
                isInverse : false
            }]
            //状态放在数组中
        };
    },
    //保存图片的坐标范围
    const : {
        centerPos : {
            x : 0,
            y : 0
        },
        xLeftMin : 0,
        xLeftMax : 0,
        xRightMin : 0,
        xRightMax : 0,
        yMin : 0,
        yMax : 0
    },
    componentDidMount : function(){
        //渲染后的状态
        //计算舞台和图片组件的宽高
        var stageDOM = this.refs.stage,
            //缓存渲染后的实体DOM元素 通过ref取值
            wStageDOM = stageDOM.offsetWidth,
            hStageDOM = stageDOM.offsetHeight,
            //获取宽高
            wHalfStageDOM = wStageDOM / 2,
            hHalfStageDOM = hStageDOM / 2;
        var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure),
            wImgFigureDOM = imgFigureDOM.offsetWidth,
            hImgFigureDOM = imgFigureDOM.offsetHeight,
            wHalfImgFigureDOM = wImgFigureDOM / 2,
            hHalfImgFigureDOM = hImgFigureDOM / 2;

        //计算图片组件的位置范围
        this.const = {
            centerPos : {
                x : wHalfStageDOM - wHalfImgFigureDOM,
                y : hHalfStageDOM - hHalfImgFigureDOM
            },
            xLeftMin : -wHalfImgFigureDOM,
            xLeftMax : wHalfStageDOM - wHalfImgFigureDOM * 3,
            xRightMin : wHalfStageDOM + wHalfImgFigureDOM,
            xRightMax : wStageDOM - wHalfImgFigureDOM,
            yMin : -hHalfImgFigureDOM,
            yMax : hStageDOM - hHalfImgFigureDOM
        }
        this.rearrage(0);//默认第一张图片居中显示
    },
    //把centerIdx对应的图片居中显示
    rearrage : function(centerIdx){
        var imgInfoArr = this.state.imgInfoArr;

        for(var i=0; i<imgInfoArr.length; i++){
            if(i < imgInfoArr.length / 2){
                imgInfoArr[i].pos = {
                    x : getRandom(this.const.xLeftMin, this.const.xLeftMax),
                    y : getRandom(this.const.yMin, this.const.yMax)
                };
            }else{
                imgInfoArr[i].pos = {
                    x : getRandom(this.const.xRightMin, this.const.xRightMax),
                    y : getRandom(this.const.yMin, this.const.yMax)
                };
            }
            imgInfoArr[i].rotate = getRandom(-30, 30);
            imgInfoArr[i].isCenter = false;
            imgInfoArr[i].isInverse = false;
        }
        imgInfoArr[centerIdx].pos = {
            x : this.const.centerPos.x,
            y : this.const.centerPos.y
        };
        imgInfoArr[centerIdx].rotate = 0;
        imgInfoArr[centerIdx].isCenter = true;
        this.setState({
            imgInfoArr : imgInfoArr
        });
    },
    center : function(centerIdx){
        return function(idx){
            this.rearrage(idx);
        }.bind(this, centerIdx);
    },
    inverse : function(idx){
        return function(idxs){
            this.state.imgInfoArr[idx].isInverse = !this.state.imgInfoArr[idx].isInverse;
            this.setState({
                imgInfoArr : this.state.imgInfoArr
            });
        }.bind(this, idx);
    },
    render : function(){
        var imgFigureArr = [];
        var controllerArr = [];
        imgDatas.forEach(function(value, index, arr){
            //对16个图片组件的位置进行初始化
            if(!this.state.imgInfoArr[index]){
                this.state.imgInfoArr[index] = {
                    pos : {
                        x : 0,
                        y : 0
                    },
                    rotate : 0,
                    isCenter : false,
                    isInverse : false
                };
            }
            imgFigureArr.push(<ImgFigure key={index} info={value} 
                data={this.state.imgInfoArr[index]} ref="imgFigure" 
                center={this.center(index)} inverse={this.inverse(index)}>);//尖括号前加/
            controllerArr.push(<Controller key={index} data={this.state.imgInfoArr[index]} 
                center={this.center(index)} inverse={this.inverse(index)}>);//尖括号前加/
        }.bind(this));
        return (
            <section className="stage" ref="stage">
                <section>
                    {imgFigureArr}
                <section>//尖括号前加/
                <section className="nav">
                    {controllerArr}
                </section>
            </section>

        );
    }
});

ReactDOM.render(
    <Photowall/>,
    document.getElementById("photowall")
);

function getRandom(low, high){
    return Math.ceil(Math.random() * (high - low) + low); 
}











