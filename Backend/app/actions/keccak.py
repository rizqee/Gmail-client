RC = ["0000000000000001",
      "0000000000008082",
      "800000000000808A",
      "8000000080008000",
      "000000000000808B",
      "0000000080000001",
      "8000000080008081",
      "8000000000008009",
      "000000000000008A",
      "0000000000000088",
      "0000000080008009",
      "000000008000000A",
      "000000008000808B",
      "800000000000008B",
      "8000000000008089",
      "8000000000008003",
      "8000000000008002",
      "8000000000000080",
      "000000000000800A",
      "800000008000000A",
      "8000000080008081",
      "8000000000008080",
      "0000000080000001",
      "8000000080008008"]

RO = [[0, 1, 62, 28, 27],
      [36, 44, 6, 55, 20],
      [3, 10, 43, 25, 39],
      [41, 45, 15, 21, 8],
      [18, 2, 61, 56, 14]]

d = "00000110"
r = 1088
c = 512
b = 1600


class Keccak:
    def stringToBinString(self,msg):
        res = ''.join(format(ord(i), '08b') for i in msg) 
        res = str(res)
        return res

    def pad(self, msg):
        res = self.stringToBinString(msg)
        res = res + d
        while (len(res) % r != 0):
            res = res + "0"
        res_list = [res[i:i+r] for i in range(0, len(res), r)]
        res_list[len(res_list)-1] = "{0:01088b}".format(int(res_list[len(res_list)-1], 2) ^ int("80",16))
        return res_list

    def f_function(self, state):
        new_state = state
        for i in range(24):
            new_state = self.round_function(new_state, RC[i])
        
        return new_state

    def round_function(self, state, rc):
        new_state = state
        c = []
        for i in range(5):
            temp = "{0:064b}".format(int(state[i][0], 2) ^ int(state[i][1], 2) ^ int(state[i][2], 2) ^ int(state[i][3], 2) ^ int(state[i][4], 2))
            c.append(temp)
        
        d = []
        for i in range(5):
            temp = "{0:064b}".format(int(c[i-1], 2) ^ int(self.rot(c[(i+1) % 5],1),2))
            d.append(temp)
        
        for i in range(5):
            for j in range(5):
                new_state[i][j] = "{0:064b}".format(int(new_state[i][j], 2) ^ int(d[i],2))
        b = []
        row = []
        for i in range(5):
            init_val = '0' * 64
            row.append(init_val)
        for i in range(5):
            b.append(row)

        for i in range(5):
            for j in range(5):
                b[j][(i*2 + j*3) % 5] = self.rot("{0:064b}".format(int(new_state[i][j], 2)), RO[j][i])

        for i in range(5):
            for j in range(5):
                new_state[i][j] = "{0:064b}".format(int(b[i][j], 2) ^ (~(int(b[(i+1) % 5][j], 2)) & int(b[(i+2) % 5][j], 2)))

        new_state[0][0] = "{0:064b}".format(int(new_state[0][0], 2) ^ int(rc,16))

        return new_state

    def rot(self, binString, num):
        shift = num % 64
        new_string = binString[shift:] + binString[:shift]
        return new_string

    def absorb(self, res_list):
        state = []
        row = []
        for i in range(5):
            init_val = '0' * 64
            row.append(init_val)
        for i in range(5):
            state.append(row)
        
        for res in res_list:
            temp = [res[i:i+64] for i in range(0, len(res), 64)]
            cont = True
            for i in range(5):
                for j in range(5):
                    if ((i*j) + j < len(temp)):
                        state[i][j] = "{0:064b}".format(int(state[i][j], 2) ^ int(temp[i*j + j],2))
                    else:
                        cont = False
                        break
                if(not(cont)):
                    break
            state = self.f_function(state)
        
        return state

    def squeeze(self, state):
        tempState = state
        z = ""
        while(len(z) < 256):
            cont = True
            for i in range(5):
                for j in range(5):
                    if ((i*j) + j < 17):
                        z = z + tempState[i][j]
                    else:
                        cont = False
                        break
                if(not(cont)):
                    break
            tempState = self.f_function(tempState)

        output = z[:256]
        return output

    def binStringToString(self, binString):
        output = ""
        for i in range(0, len(binString), 7): 
            temp = binString[i:i + 7] 
            decimal = int(temp, 2) 
            output = output + chr(decimal)
        
        return output

    def hash(self, msg):
        res_list = self.pad(msg)
        state = self.absorb(res_list)
        binString = self.squeeze(state)
        output = self.binStringToString(binString)
        return output

    def hashOutputBinary(self, msg):
        res_list = self.pad(msg)
        state = self.absorb(res_list)
        output = self.squeeze(state)
        return output