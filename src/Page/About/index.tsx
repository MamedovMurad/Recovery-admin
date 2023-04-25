import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Col, Modal, Row, Upload } from "antd";
import { useEffect, useState } from "react";
import agent, { baseImageUrl } from "../../App/Api";
import { AboutType } from "../../App/Model/types";
import AboutContainer from "../../containers/about";
import "./index.css";
type AboutProps = {};

const About: React.FC<AboutProps> = () => {
  const [aboutData, setaboutData] = useState<null | AboutType>(null);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  async function fetchApi() {
    const res = await agent.about.get();
    res.data && setaboutData(res.data);
    console.log(res.data);
    
    setOpen(false);
  }
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
 

  useEffect(() => {
    fetchApi();
 
  }, []);

  return (
    <>

      <Row>
        <Col span={18}> </Col>
        <Col span={6}>
          <Button
            onClick={() => setOpen(true)}
            type="primary"
            loading={confirmLoading}
            block
            style={{ margin: "20px 0" }}
          >
            Update
          </Button>
        </Col>
      </Row>
      <div className="site-card-border-less-wrapper">
        <Card
          title={aboutData?.title_az}
          cover={
            <img
            alt={aboutData?.title_az}
              src={baseImageUrl + aboutData?.image}
              style={{ width: "300px", paddingTop: "20px" }}
            />
          }
        >
          <p>{aboutData?.description_az}</p>
        </Card>
      </div>

      <Modal
        title="About edit"
        width={"65%"}
        open={open}
        /*     onOk={handleOk} */
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          <>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              /* onClick={handleOk}  */ form="AddSLider"
              htmlType="submit"
              loading={confirmLoading}
            >
              Ok
            </Button>
          </>,
        ]}
      >
        <AboutContainer about={aboutData || undefined} callback={fetchApi} />
      </Modal>
    </>
  );
};

export default About;
