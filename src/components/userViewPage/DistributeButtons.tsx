import { Box, Fab, SxProps, Theme } from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useDispatch, useSelector } from "react-redux";
import { addHandledUserId } from 'store/vkUserListSlice';
import { changeUserDistribution } from 'store/currentUserSlice';
import * as backend from 'services/backend/backend';
import { useNavigate } from "react-router-dom";
import { UserDistribution, UserPage } from "services/backend/ApiModels/UserPage";

/*

    Если юзер уже находится в списке лайков то кнопка с лайком должна выглядеть больше остальных и выглядеть ярче других (выделяться)
    Таким образом можно находясь в другом списке понять где сеййчас этот юзер (в случае если это grayed-out элемент)

*/

/*
    Лайкать хочется по разным критериям.
    Для дизлайка должен быть четкий критерий - например страшная пиздец, либо интересы полное говно. Либо вообще непонятно что.

    Для лайка же может быть куча причин или просто хочешь вернуться позже. Тут должны быть градации.



    Я думаю что надо сделать базовых 2 кнопки - лайк и дизлайк. Без списка отложенных.


    НО - для списка лайков должны быть параметры/градации и фильтры при просмотре этого списка.

    При лайке будет просто одна кнопка лайка которая будет означать некое средне-высокое значение параметров.
    Параметров может быть несколько - оценка внешности (тут же вариант что не видно внешности, что бывает часто), оценка соответствия интересам/интересность (либо опять же вариант когда непонятно.)
    Также возможно потом будут пользовательские параметры которые сам пользователь создает в настройках и сам может оценивать для каждого юзера которого он лайкает.


    То есть я думаю что у кнопки лайка рядышком будет кнопка типа расширенной инфы, либо эта инфа будет как-то вылезать при наведении на кнопку лайка.
    По дефолту там будет
        1) оценка внешности либо галочка "внешности не видно" и галочка "оценю позже / предварительная оценка"
        2) оценка соответствия интересов (интересность) либо галочка "интересы не понятны" и "оценю позже / предварительная оценка"
    Если нажать просто лайк (а так же значения изначальные выставленные) - будут выбраны средние значения оценок по каждому параметру (возможно эти дефолтные значения сам юзер сможет менять в настройках).
    Если юзер нажал просто кнопку, без явного выбора параметров - инфа про это будет тоже сохранена (это нужно чтобы потом лучше сортировать юзеров).

    В списке лайков будут фильтры для сортировки и поиска, которые будут учитывать просталвенные оценки а также доп. фильтры типа возраста (или примерного возраста), близости к тебе и т.д.
    Например в фильтре в списке лайков можно будет искать по бегунку - важность между внешностью и интересами. Грубо говоря если ползунок в сторону внешности -
    то большой приоритет в поиске будет по выставленной оценке внешности, если по интересам - то по оценке интересов.


    Я думаю что в момент после выставления лайка или изменения параметров лайка - в бд будет сохраняться некоторые "кэши" - проситанные совокупные оценки, которые потом будут использоваться для сортировки и поиска через фильтры на странице лайков.

    Также у каждой анкеты будет комментарий от аккаунта. Причем он хранится и для дизлайкнутых тоже и его можно писать независимо от оценки - сразу тоже.

    Получается дефолтно всегда будут 2 базовые оценки (при лайке) - внешность и интересы.

    Каждая оценка это сама оценка (градация от 0 до 10 например или что то такое) либо галочка "оценить невозможно (когда не видно внешности или непонятны интересы)". Если галочка стоит то оценка не ставится.
    И также в случае если ставится оценка - можно поставить галочку "предварительная оценка" - это означает что пользователь аккаунта не уверен до конца в этой оценке либо хочет позже пере-оценить, когда появится время на это (например если сначала оценивается поверхностно).

    Смысл поверхностных оценок в том что для нормальной оценки нужно время и исследовать анкету, а хочется просто сделать первоначальную фильтрацию большого кол-ва юзеров. Но некоторые из этих юзеров например сразу видно внешность норм или нет,
    без сомнений - тогда эта галочка не ставится и сразу ставится "уверенная" оценка.

    Эти штуки будут учитываться при сортировке/фильтрации на странице лайкнутых.


    Соответственно остается только 2 списка - это список лайнутых и список дизлайкнутых (который поидее вообще не показывается сходу).
    Отложенных больше не будет - вместо них неуверенные оценки в лайкнутых.
*/


/*
 
На кнопке "оценить" можно сделать небольшой индикатор загрузки, в случае если процессинг по авто-оценке еще работает.
При наведении - инфа о том что процессинг еще работает в фоне. - Пока процессинг не закончился - ajax-ом раз в какое то время пере-запрашивать статус.
 
*/

const likeSx: SxProps<Theme> = {
    color: '#527e06',
    backgroundColor: '#8de654'
};

const dislikeSx: SxProps<Theme> = {
    color: '#bb1111',
    backgroundColor: '#ff7171'
};

export interface Props {
    userId: number
}

function DistributeButtons({ userId }: Props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handledUserIds = useSelector((state: any) => (state.vkUserList.handledUserIds as number[]));
    const page = useSelector((state: any) => (state.currentUser.page as UserPage));

    async function likeClickHandler() {
        const isUserAlreadyHandled = handledUserIds.indexOf(userId) !== -1;

        if (!isUserAlreadyHandled) {
            dispatch(addHandledUserId(userId));
        }

        const newUserId = await backend.userDistribution.likeUser(userId);

        if (newUserId !== null && !isUserAlreadyHandled) {
            navigate(`/users/${newUserId}`);
            return;
        }

        dispatch(changeUserDistribution(UserDistribution.Liked));
    }

    async function dislikeClickHandler() {
        const isUserAlreadyHandled = handledUserIds.indexOf(userId) !== -1;

        if (!isUserAlreadyHandled) {
            dispatch(addHandledUserId(userId));
        }

        const newUserId = await backend.userDistribution.dislikeUser(userId);

        if (newUserId !== null && !isUserAlreadyHandled) {
            navigate(`/users/${newUserId}`);
            return;
        }

        dispatch(changeUserDistribution(UserDistribution.Disliked));
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                <Fab sx={likeSx} onClick={likeClickHandler} disabled={page.userDistribution === UserDistribution.Liked}>
                    <ThumbUpIcon />
                </Fab>
                <Fab sx={dislikeSx} onClick={dislikeClickHandler} disabled={page.userDistribution === UserDistribution.Disliked}>
                    <ThumbDownIcon />
                </Fab>
            </Box>
        </Box>
    );
}

export default DistributeButtons;