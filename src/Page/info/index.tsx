import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Col, Modal, Row, Upload } from "antd";
import { useEffect, useState } from "react";
import agent, { baseImageUrl } from "../../App/Api";
import { AboutType } from "../../App/Model/types";
import AboutContainer from "../../containers/about";
import InfoContainer from "../../containers/info";



type AboutProps = {};

const Info: React.FC<AboutProps> = () => {
  const [aboutData, setaboutData] = useState<null | AboutType>(null);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  async function fetchApi() {
    const res = await agent.page.get();
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
     
        >
          <p dangerouslySetInnerHTML={ { __html: aboutData?.description_az } }></p>
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
        {aboutData &&<InfoContainer about={aboutData} callback={fetchApi} />}
      </Modal>
    </>
  );
};

export default Info;
