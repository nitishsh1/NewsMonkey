import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: "8",
    category: "general",
  };

  static propsTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props);
    console.log("this is a constructor");

    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0,
    };
    document.title = `${this.capitalizeFirstLetter(
      this.props.category
    )}-NewsMonkey`;
  }

  async componentDidMount() {
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=a648f8c92ad8425b86e2adaafa590db6&key=cricket&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    // let data = await fetch(url);
    // let parsedData = await data.json();
    // console.log(parsedData);
    // this.setState({articles:parsedData.articles,totalResults:parsedData.totalResults,loading:false});
    this.updateNews(this.state.page);
  }

  async updateNews(page) {
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&key=cricket&page=${page}&pageSize=${this.props.pageSize}`;
    // this.setState({ loading: true });
    this.props.setProgress(10);
    let data = await fetch(url);
    this.props.setProgress(40);
    let parsedData = await data.json();
    
    console.log(parsedData);
    this.setState({
    //   articles: parsedData.articles,
        articles:this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
  }

  handlePrevClick = async () => {
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=a648f8c92ad8425b86e2adaafa590db6&key=cricket&page=${this.state.page-1}&pageSize=${this.props.pageSize}`;
    // this.setState({loading:true});
    // let data = await fetch(url);
    // let parsedData = await data.json();
    // console.log(parsedData);
    // this.setState({page : this.state.page-1,articles:parsedData.articles,loading:false});
    this.setState({ page: this.state.page - 1 }, () => {
      this.updateNews(this.state.page);
    });
  };

  handleNextClick = async () => {
    console.log("next");
    // if(this.state.page+1 > Math.ceil(this.state.totalResults/this.props.pageSize)){

    // }else{
    //     let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=a648f8c92ad8425b86e2adaafa590db6&key=cricket&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
    //     this.setState({loading:true});
    //     let data = await fetch(url);
    //     let parsedData = await data.json();

    //     this.setState({
    //         page : this.state.page+1,
    //         articles:parsedData.articles,
    //         loading:false
    //     });
    // }

    this.setState({ page: this.state.page + 1 }, () => {
      this.updateNews(this.state.page);
    });
  };

  fetchMoreData = () => {
    this.setState({ page: this.state.page + 1 },() => {
        this.updateNews(this.state.page);
      });
  };

  render() {
    return (
      <div>
        <div className="container my-3">
          <h1 className="text-center" style={{ margin: "35px 0px" }}>
            NewsMonkey - Top Headlines from{" "}
            {this.capitalizeFirstLetter(this.props.category)}
          </h1>
          {this.state.loading&&<Spinner/>}
                {/* {!this.state.loading &&    <div className="row">
                    {this.state.articles?this.state.articles.map((element, index) => {
                        return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                    }):null}
                        
                </div>
                } */}
          <InfiniteScroll
            dataLength={this.state.articles.length}
            next={this.fetchMoreData}
            hasMore={this.state.articles.length!==this.state.totalResults}
            loader={<Spinner/>}
            >
            <div className="container">
             <div className="row">
                    {this.state.articles?this.state.articles.map((element, index) => {
                        return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title?element.title:""} description={element.description?element.description:""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                    }):null}
                        
                </div>
            </div></InfiniteScroll>  
          {/* <div className="container my-2 d-flex justify-content-between">
            <button
              type="button"
              disabled={this.state.page <= 1}
              onClick={this.handlePrevClick}
              className="btn btn-primary"
            >
              &larr;Previou
            </button>
            <button
              type="button"
              disabled={
                this.state.page + 1 >
                Math.ceil(this.state.totalResults / this.props.pageSize)
              }
              onClick={this.handleNextClick}
              className="btn btn-primary"
            >
              Next&rarr;
            </button>
          </div> */}
        </div>
      </div>
    );
  }
}

export default News;
